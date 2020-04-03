'use strict';
/*
 * @author:    Caleb Nii Tetteh Tsuru Addy(Virus) 
 * @date:      1st April, 2020 
 * @email:     100percentvirusdownloading@gmail.com 
 * @twitter:   @niitettehtsuru
 * @github :   https://github.com/niitettehtsuru/Overlap
 * @license:   GNU General Public License v3.0
 */
//a single node that moves between random positions. ref: https://inconvergent.net/2016/shepherding-random-numbers/
class Node
{
    constructor(screenWidth,screenHeight,xcoordinateOfNodeCenter)
    {     
        this.screenWidth        = screenWidth; 
        this.screenHeight       = screenHeight; 
        /*A little explanation: 
         * Every Node object has two nodes, an alpha node and a beta node. 
         * The alpha node is the leading node(always stationary), and the beta node is the trailing node( always trying to catch up with the alpha). 
         **/
        this.framePerUnitTime   = 100;//makes the velocity of all nodes proportional to the distance between the alpha and beta, so that all betas 
        //can start at any point and still merge with their alphas at the same time. 
        this.radius             = 0.2;  
        this.color              = 'black';  
        this.pauseMotionCounter = 0;//control to pause for a few seconds when a beta node merges with an alpha
        this.toggleYDirection   = true; //switches between moving up and moving down 
        this.velocity           = this.getVelocity();//the direction and speed of movement  
        //set the starting position of the node on the canvas  
        this.xcoordOfCenter     = xcoordinateOfNodeCenter; /*NB:Both alpha and beta nodes have the same xcoordinate ie this.xcoordOfCenter */  
        this.ycoordOfAlphaNode  = 0;   
        this.ycoordOfBetaNode   = 0;   
        this.restart();
    }  
    getColor() 
    {  
        return color; 
    } 
    /**
    * Let node correspond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    * @param  {number} dy           The percentage change in browser window height 
    * @param  {number} dx           The percentage change in browser window width  .  
    */
    refreshScreenSize(screenHeight,screenWidth,dx,dy)
    {   
        this.screenHeight       = screenHeight;  
        this.screenWidth        = screenWidth; 
        this.xcoordOfCenter     *= dx; 
        this.ycoordOfAlphaNode  *= dy; 
        this.ycoordOfBetaNode   *= dy; 
        //reset the velocity
        var x = 0;//nodes don't move horizontally
        var y = Math.abs(this.ycoordOfAlphaNode - this.ycoordOfBetaNode)/this.framePerUnitTime;
        var velocity = {x:x, y: this.toggleYDirection? y: -y}; 
        this.setVelocity(velocity); 
    }  
    getVelocity() 
    {  
        var x = 0;//nodes don't move horizontally
        var y = Math.abs(this.ycoordOfAlphaNode - this.ycoordOfBetaNode)/this.framePerUnitTime;
        return {x:x, y: this.toggleYDirection? -y: y};
    } 
    setVelocity(velocity) 
    {
        this.velocity = velocity; 
    }
    draw(ctx)
    {   
        //draw the alpha/leading node
        /*
        ctx.beginPath(); 
        ctx.arc(this.xcoordOfCenter,this.ycoordOfAlphaNode,this.radius,0,2*Math.PI); 
        ctx.fillStyle =  'rgba(0,0,0,0.4)'; 
        ctx.fill(); 
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';//this.color;
        ctx.stroke(); 
        */ 
        //draw lines from alpha to touch beta node
        /*
        ctx.beginPath();
        ctx.moveTo(this.xcoordOfCenter, this.ycoordOfBetaNode);
        //this.ycoordOfBetaNode
        ctx.lineTo(this.xcoordOfCenter, this.toggleYDirection? this.ycoordOfAlphaNode - this.radius: this.ycoordOfAlphaNode + this.radius );
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.stroke();
        */ 
        /*
        if(this.toggleYDirection) //beta should move up to meet alpha
        {   //draw lines from alpha to touch celing
            ctx.beginPath();
            ctx.moveTo(this.xcoordOfCenter, 0);
            ctx.lineTo(this.xcoordOfCenter, this.ycoordOfAlphaNode);
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.stroke(); 
        }
        else 
        {   //draw lines from alpha to touch floor
            ctx.beginPath();
            ctx.moveTo(this.xcoordOfCenter, this.ycoordOfAlphaNode);
            ctx.lineTo(this.xcoordOfCenter, this.screenHeight);
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.stroke(); 
        }
        */
              
        //draw the beta/trailing node
        /*
        ctx.beginPath(); 
        ctx.arc(this.xcoordOfCenter,this.ycoordOfBetaNode,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color; 
        ctx.fill(); 
        ctx.strokeStyle = this.color;
        ctx.stroke(); 
        */
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
    restart()//vertically separate the alpha from the beta node and let the beta chase the alpha again. 
    { 
        if(this.toggleYDirection) //beta should move up to meet alpha
        {
            this.ycoordOfAlphaNode  = this.getRandomNumber(this.radius/*so half of circle never gets stuck in top wall*/,this.screenHeight/2); 
            this.ycoordOfBetaNode   = this.getRandomNumber(this.screenHeight/2 + 20,this.screenHeight);   
        }
        else //beta should move down to meet alpha
        { 
            this.ycoordOfBetaNode   = this.getRandomNumber(0,this.screenHeight/2); 
            this.ycoordOfAlphaNode   = this.getRandomNumber(this.screenHeight/2 + 20,this.screenHeight-this.radius/*so half of circle never gets stuck in bottom wall*/);    
        }  
        this.setVelocity(this.getVelocity()); 
        this.toggleYDirection = !this.toggleYDirection; 
    }
    getCoordinatesOfCenter()
    {
        return {x:this.xcoordOfCenter,yBeta:this.ycoordOfBetaNode,yAlpha:this.ycoordOfAlphaNode}; 
    }
    update(deltaTime)
    {    
        if(this.pauseMotionCounter === 0)
        {
            this.ycoordOfBetaNode += this.velocity.y;
        } 
        if(this.toggleYDirection)//if beta is moving up to meet alpha
        {
            if(this.ycoordOfAlphaNode <= this.ycoordOfBetaNode)//if alpha and beta nodes align perfectly
            {  
                ++this.pauseMotionCounter;
                if(this.pauseMotionCounter>50)//pause for a while
                {
                    this.restart(); //and then continue
                    this.pauseMotionCounter = 0; 
                } 
            } 
        }
        else //if beta is moving down to meet alpha
        {
            if(this.ycoordOfAlphaNode >= this.ycoordOfBetaNode)//if alpha and beta nodes align perfectly
            { 
                ++this.pauseMotionCounter;
                if(this.pauseMotionCounter>50)//pause for a little while
                {
                    this.restart(); //and then continue
                    this.pauseMotionCounter = 0; 
                } 
            } 
        }     
    }      
}