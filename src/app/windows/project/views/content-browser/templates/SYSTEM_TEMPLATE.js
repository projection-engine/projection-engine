export default `
// Required return statement
return {
    props: {}, // Libraries will be initialized before constructor execution
    initialized: false, 
    // Called on initialization if present
    constructor(){
        // You can declare your event listeners here or fetch data    
    },
    __bindCamera(cameraTarget, rootCamera, transformationComponent=null){
        if(!cameraTarget)
            return        
        rootCamera.updateViewTarget(cameraTarget, transformationComponent)
    },
    // The only required method, called every frame 
    execute(entities, rootCamera){
        // Example for camera binding
        if(!this.initialized){
            this.initialized = true
            this.__bindCamera(entities.find(entity => entity.components[this.props.COMPONENTS.CAMERA]), rootCamera)
        } 
        // you can access your object reference via the "this" keyword
    }
}
`