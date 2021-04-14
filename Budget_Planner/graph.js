const dims = {
    height: 300,
    width:300,
    radius:150
}

const cent = {
    x: (dims.width / 2 + 5),
    y: (dims.height / 2 + 5)

}

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 250)
    .attr('height', dims.height + 100)

const graph = svg.append('g')
    .attr('transform',`translate(${cent.x}, ${cent.y})`)
    .attr('class','donut')

const pie = d3.pie()
    .sort(null)
    .value(d => d.cost)

const angles = pie([
    {name:'rent',cost:500},
    {name:'food',cost:500},
    {name:'computer',cost:5000},
    {name:'wacom',cost:4000},
])

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2);


const colour = d3.scaleOrdinal(d3['schemeSet3'])

//legend setup
const legendGroup = svg.append('g')
    .attr('transform', `translate(${dims.width + 40 }, 10)`)

const legend = d3.legendColor()
    .shape('circle')
    .shapePadding(10)
    .scale(colour)


const tip = d3
    .tip()
    .attr("class", "d3-tip card") // We add the d3-tip class instead of the tip class
    .html((event, d) => { // It's (event, d) instead of just (d) in v6
      let content = `<div class="name">${d.data.name}</div>`;
      content += `<div class="cost">$${d.data.cost}</div>`;
      content += `<div class="delete">Click slice to delete</div>`;
      return content;
    });
   
  graph.call(tip);

//update function
const update = (data) => {

    //update clour scale domain
    colour.domain(data.map(d => d.name))

    // update and call legend
    legendGroup.call(legend)
    legendGroup.selectAll('text').attr('fill','white')

    
    //join enhanced pie data to path elements
    const paths = graph.selectAll('path')
        .data(pie(data));

    paths.enter()
        .append('path')
            .attr('class','arc')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('fill', d => colour(d.data.name))
            .each(function(d){ this._current = d })
            .transition().duration(750)
                .attrTween("d", arcTweenEnter)

    // add event listeners

graph
    .selectAll("path")
    .on("mouseover", (event, d) => {
      tip.show(event, d);
      handleMouseOver(event, d);
    })
    .on("mouseout", (event, d) => {
      tip.hide();
      handleMouseOut(event, d);
    })
    .on("click", handleClick);
    //handle the exit selection
        paths.exit()
            .transition().duration(750)
            .attrTween('d', arcTweenExit)
            .remove()
    // handle the current DOM path updates
        paths.attr('d', arcPath)
            .transition().duration(750)
            .attrTween('d',arcTweenUpdate)
}


//data array and firestore

var data =  []

db.collection('Expenses').onSnapshot(res =>{

    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id}

        switch (change.type){
            case 'added':
                data.push(doc)
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id)
                data[index] = doc
                break;
            case 'removed':
                data = data.filter(item =>item.id !== doc.id)
                break;
            default:
                break;            
        }
    })

    update(data)

})

const arcTweenEnter = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle)

    return function(t){
        d.startAngle = i(t)
        return arcPath(d)
    }
}
const arcTweenExit = (d) => {
    var i = d3.interpolate(d.startAngle, d.endAngle )

    return function(t){
        d.startAngle = i(t)
        return arcPath(d)
    }
}

//use function keyword to allow use of 'this'

function arcTweenUpdate(d){
    var i = d3.interpolate(this._current, d)

    //update the current prop with ne updated data
    this.current = d
    return function(t){
        return arcPath(i(t))
    }
}

const handleMouseOver = (event, d) =>{
    //console.log(event.currentTarget)
    d3.select(event.currentTarget)
        .transition('changeSliceFill').duration(300)
            .attr('fill','#fff')
}

const handleMouseOut = (event,d) =>{
    d3.select(event.currentTarget)
        .transition('changeSliceFill').duration(300)
        .attr('fill', colour(d.data.name))
}

const handleClick = (event,d) => {
    const id = d.data.id
    db.collection('Expenses').doc(id).delete()
}


//Tooltip





