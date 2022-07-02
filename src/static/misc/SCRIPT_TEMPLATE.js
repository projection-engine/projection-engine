export default `
class YourClassName{
    state = {} // Your system state here
    
    constructor(){
        // Do your initialization state here
    }
    
    execute(params){
        // Called every frame
        
        // TEMPLATES    
        this.eventTick(params)
        // Some key pressed (example with KeyA)
        if(params.pressedKeys.KeyA && !this.state.pressedKeyA){
                this.state.pressedKeyA = true
                this.onKeyDown(params)
        }
        else if(params.pressedKeys.KeyA && this.state.pressedKeyA)
            this.onHold(params)
                
        else if(!params.pressedKeys.KeyA && this.state.pressedKeyA){
            this.state.pressedKeyA = false
            this.onRelease(params)
       }
    }
    
    // Templates
    eventTick(params){
        // Do things here
    }
    onHold(params){
        // Do things here
    }
    onKeyDown(params){
        // Do things here
    }
    onRelease(params){
        // Do things here
    }
}
`