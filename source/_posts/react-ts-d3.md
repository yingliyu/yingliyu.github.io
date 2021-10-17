---
toc: true
title: React-ts-d3 项目实践
tags:
  - react
  - typescript
  - d3
description: react-ts-d3
date: 2020-11-18 14:33:38
categories: ['React', 'Typescript']
---

### 前言

自从涉足了知识图谱项目便一发不可收拾，本次项目中也是涉及到一些可视化和知识图谱的元素，对我来说虽不是新的技术领域但是这次改用了 `ts`，所以还是踩了不少的坑呢，主要集中在 `d3` 和 `ts` 结合部分。

其次在项目评审期间，前端主要问题还有自适应方面的问题，最终敲定使用断点媒体查询的方式实现。

近期 `bug` 修复进入尾声，时隔数日还是复盘一下，毕竟我的脑瓜子还是一如既往的健忘，刚刚被问及一个项目是不是我做的，我记得是我做的，但是具体内容什么的我已经无力想起了，不过看到我还是认识的。言归正传，下面就来回顾一下踩坑流水帐。

### 1. Echarts Graph

如果使用过 `echart` 系列图表，那么 `graph` 关系图还是相对比较容易上手的，毕竟是高度可定制化套路一样同类型属性名也一样。

<!--more-->

但是使用过程中我还是踩到了坑：由于数据返回节点的 `name` 字符比较长，为了美观前端显示的时候要做个性化样式设计包括换行超出字符省略等等，我天真又粗暴的直接在 `name` 上动刀了，虽然我知道 `name` 不能有重复，但我还是撞了南墙，因为部分 `name` 做个性化处理之后显示的剩余那部分字符相同，所以触碰了 `name` 不能重复的红线。
解决：`name` 拿来原封不动，在 `label` 上做 `formatter` 处理。

> 注意：每一个节点的 `name` 要唯一，如果有重复的 `name` 就会报如下错，类似于遍历时的 `key` 值是唯一的。

![image1](pic1.png)

### 2. 词云 echarts-wordcloud

这是一个基于 `echarts` 封装的第三方库，使用中没有踩到值得一提的坑。
部分代码如下：

```js
interface IWordCloud {
    list: ICommonProps[];
    width: number;
    height: number;
    fontSizeRange: number[];
}
const WordCloud: React.FC<IWordCloud> = (props: IWordCloud) => {
    const { list, width, height, fontSizeRange } = props;

    useEffect(() => {
        drawWordCloud();
    }, [list]);

    const drawWordCloud = () => {
        const wordElement = document.getElementById('wordCloud');
        let chart = echarts.init(wordElement as HTMLDivElement);
        let data = [];
        for (let index in list) {
            data.push({
                name: list[index].name,
                value: Math.sqrt(list[index].value)
            });
        }
        let maskImage = new Image();
        maskImage.src = bg;
        let option = {
            series: [
                {
                    type: 'wordCloud',
                    left: 'center',
                    top: 'center',
                    width: '100%',
                    height: '100%',
                    right: null,
                    bottom: null,
                    sizeRange: fontSizeRange, // 字号
                    rotationRange: [-90, 90],
                    rotationStep: 90,
                    gridSize: fontSizeRange[0] - 2,
                    shape: 'circle', // diamond/triangle/circle/pentagon/star
                    // maskImage: maskImage,
                    textStyle: {
                        normal: {
                            // fontFamily: '微软雅黑',
                            // fontWeight: 'normal',
                            // Color can be a callback function or a color string
                            color: function () {
                                // Random color
                                return WORD_CLOUD_COLORS[Math.floor(Math.random() * 3)];
                            }
                        },
                        emphasis: {
                            shadowBlur: 2,
                            shadowColor: '#1890ff'
                        }
                    },
                    data: data
                }
            ]
        };
        chart.setOption(option);
    };
    return <div id="wordCloud" style={{ height: height, width: width }} />;
};
```

效果图如下：
![image](pic2.png)

### 3.echarts legend 个性化细节

可能对别人来说是小儿科，只是它是我初次发现的比较符合我项目中需求的点。

1.`legend` 图例标记的图形除了定制的哪几种形状还可以设置宽高 `itemWidth`、`itemHeight`。 2.`legend` 文字块的宽定制这样可以是 `value` 左对齐。 3.`legend` 也有 `tooltip`。
如下图：
![image3](pic3.png)

### 4. d3 力导向图—— force

使用 `ts` 时部分第三方库的定义的各种类型定位起来还是有点烧脑的。
我在使用过程中 drag 函数的范型大概折磨了我一周左右最后在庄哥的帮助下终于解决了。
![img4](pic4.png)

部分代码：

```js
// create a force simulation
    const initForceSimulation = () => {
        try {
            const linkForce = d3
                .forceLink<INode, ILink>(linksData)
                .id((data: INode) => data.id)
                .distance(200);
            const nodeCollision = d3
                .forceCollide()
                .radius(80)
                .iterations(0.5)
                .strength(0.5);
            const nodeCharge = d3.forceManyBody().strength(-300).theta(0.01);
            simulationRef.current = d3
                .forceSimulation<INode, ILink>(nodesData)
                .alpha(0.3) // 活力，渲染之后再自动动多久到达目标位置
                .force('link', linkForce) // 映射id & 线的长度
                .force('x', d3.forceX())
                .force('y', d3.forceY())
                .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
                .force('collision', nodeCollision)// 避免节点相互覆盖
                .force('charge', nodeCharge);// 节点间相互排斥的电磁力

            simulationRef.current.nodes(nodesData).on('tick', () => {
                edges
                    .attr('x1', ({ source }) => (source as INode).x || 0)
                    .attr('y1', ({ source }) => (source as INode).y || 0)
                    .attr('x2', ({ target }) => (target as INode).x || 0)
                    .attr('y2', ({ target }) => (target as INode).y || 0);
                nodes.attr('transform', (data: any) => `translate(${data.x}, ${data.y})`);
                edgepaths.attr(
                    'd',
                    ({ target, source }) =>
                        'M ' +
                        (source as INode).x +
                        ' ' +
                        (source as INode).y +
                        ' L ' +
                        (target as INode).x +
                        ' ' +
                        (target as INode).y
                );
            });
            const edges = drewLines(); // draw lines
            const nodes = drawNodes(); // draw nodes
            const edgepaths = drawEdgeLabel(); // draw relation label
        } catch (error) {
            console.log(error);
            message.error('内部错误，' + JSON.stringify(error));
        }
    };
```

最后，推荐一个切换全屏库： screenfull。
