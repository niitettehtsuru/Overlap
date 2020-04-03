'use strict';
/*
 * @author:    Caleb Nii Tetteh Tsuru Addy(Virus) 
 * @date:      1st April, 2020 
 * @email:     100percentvirusdownloading@gmail.com 
 * @twitter:   @niitettehtsuru
 * @github :   https://github.com/niitettehtsuru/Overlap
 * @codepen:   https://codepen.io/niitettehtsuru/pen/zYGQYZj
 * @license:   GNU General Public License v3.0
 */
class Painter
{
    constructor(screenWidth,screenHeight)
    {      
        this.screenWidth   = screenWidth;
        this.screenHeight  = screenHeight; 
        this.numOfNodeSets = 1; 
        this.nodeSets       = this.spawnNodesSets(this.numOfNodeSets);
    } 
    /**
    * Let canvas respond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    */
    refreshScreenSize(screenHeight,screenWidth)
    { 
        if(this.screenHeight !== screenHeight || this.screenWidth !== screenWidth)//if the screen size has changed
        { 
            var dy          = screenHeight/this.screenHeight;//percentage change in browser window height 
            var dx          = screenWidth/this.screenWidth;  //percentage change in browser window width  
            this.screenHeight = screenHeight;  
            this.screenWidth  = screenWidth;   
            this.nodeSets.forEach(function(nodeSet)
            {
                nodeSet.forEach(function(node)
                {
                    node.refreshScreenSize(screenHeight,screenWidth,dx,dy);//adjust the screen size of each node 
                });  
            });
        } 
    } 
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    }
    spawnNodesSets(numOfNodeSets)
    {  
        var nodeSets = []; 
        for( var k = 0; k < numOfNodeSets; k++)
        {
            var numOfNodes = 30;//this.getRandomNumber(2, 50);  
            var horizontalSpaceBetweenNodes = this.screenWidth/(numOfNodes+1);//space nodes horizontally at regular intervals 
            var nodes   = [];
            for(var i = 0; i < numOfNodes; i++)
            { 
                var xCoordinate = horizontalSpaceBetweenNodes * (i+1); 
                nodes.push(new Node(this.screenWidth,this.screenHeight,xCoordinate));  
            } 
            nodeSets.push(nodes); 
        } 
        return nodeSets; 
    } 
    update(deltaTime)
    {          
        this.nodeSets.forEach(function (nodeSet)//update all nodes
        {     
            nodeSet.forEach(function (node) 
            {      
                node.update(deltaTime);     
            });    
        });     
    }  
    draw(ctx)
    {      
        this.nodeSets.forEach(function(nodeSet)
        {
            nodeSet.forEach(function(node)
            {
                node.draw(ctx); 
            }); 
        }); 
        var centerCoordinatesOfNodes =  this.nodeSets.reduce(function(array, nodeSet) 
        {  
            nodeSet.forEach(function(node)
            {
                var coord = node.getCoordinatesOfCenter(); 
                array.push(coord);
            });   
            return array; 
        }, []);
        
        for(var i = 0; i < centerCoordinatesOfNodes.length; i++)
        {
            var color = this.getRandomColor(0.4); 
            if(i < centerCoordinatesOfNodes.length -2)
            {
                //draw triangle to link neighbouring beta nodes
                var point1 = {x:centerCoordinatesOfNodes[i].x,y:centerCoordinatesOfNodes[i].yBeta};
                var point2 = {x:centerCoordinatesOfNodes[i+1].x,y:centerCoordinatesOfNodes[i+1].yBeta};
                var point3 = {x:centerCoordinatesOfNodes[i+2].x,y:centerCoordinatesOfNodes[i+2].yBeta}; 
                this.drawTriangle(point1,point2,point3,ctx,color); 
                //draw triangle to link neighbouring alpha nodes
                var point4 = {x:centerCoordinatesOfNodes[i].x,y:centerCoordinatesOfNodes[i].yAlpha};
                var point5 = {x:centerCoordinatesOfNodes[i+1].x,y:centerCoordinatesOfNodes[i+1].yAlpha};
                var point6 = {x:centerCoordinatesOfNodes[i+2].x,y:centerCoordinatesOfNodes[i+2].yAlpha}; 
                this.drawTriangle(point4,point5,point6,ctx,color); 
            }  
        }  
    }
    drawTriangle(point1,point2,point3,ctx,color)
    {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.fillStyle = color;//this.getRandomColor(0.3);
        ctx.fill();   
    }
    drawLine(point1,point2,ctx)
    {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.strokeStyle = this.getRandomColor(0.3); 
        ctx.stroke();  
    }
    drawCurve(point1,point2)
    {
        this.ctx.beginPath();
        this.ctx.moveTo(point1.x, point2.y);
        var xc = (point1.x + point2.x) / 2;
        var yc = (point1.y + point2.y) / 2;
        this.ctx.quadraticCurveTo(point1.x, point1.y, xc, yc);
        this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        this.ctx.stroke();  
    }
    getRandomColor(opacity)
    {
        var colors = [
            `rgba(255,0,0,      ${opacity})`,//red
            `rgba(255, 242,0,   ${opacity})`,//yellow, 
            `rgba(0,0,255,      ${opacity})`,//blue
            `rgba(255,255,0,    ${opacity})`,//yellow
            `rgba(0,255,255,    ${opacity})`,//cyan
            `rgba(255,0,255,    ${opacity})`,//magenta/fuchsia
            `rgba(192,192,192,  ${opacity})`,//silver
            `rgba(128,128,128,  ${opacity})`,//gray 
            `rgba(128,0,0,      ${opacity})`,//maroon
            `rgba(128,128,0,    ${opacity})`,//olive
            `rgba(0,128,0,      ${opacity})`,//green
            `rgba(128,0,128,    ${opacity})`,//purple 
            `rgba(0,128,128,    ${opacity})`,//teal
            `rgba(0,0,128,      ${opacity})`,//navy 
            `rgba(0, 255, 0,    ${opacity})`,//green
            `rgba(77, 0, 255,   ${opacity})`,//blue
            `rgba(255, 0, 140,  ${opacity})`,//purple
            `rgba(0,255,0,      ${opacity})`//lime
        ];
        return colors[parseInt(this.getRandomNumber(0, colors.length))];
    }
}
