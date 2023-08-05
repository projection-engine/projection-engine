import AbstractSingleton from "../core/AbstractSingleton";
import DynamicMap from "../core/resource-libs/DynamicMap";
import EditorEntity from "./EditorEntity";

export default class EditorEntityManager extends AbstractSingleton{
    #entities = new DynamicMap<EngineEntity, EditorEntity>()

    static get entities(){
        return this.get<EditorEntityManager>().#entities
    }


}
