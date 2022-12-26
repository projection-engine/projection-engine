export default class AlertController{
    static defaultDelay = 3500
    static success = (...messages:string[]):void => null
    static error = (...messages:string[]):void => null
    static warn = (...messages:string[]):void => null
    static log = (...messages:string[]):void => null
}