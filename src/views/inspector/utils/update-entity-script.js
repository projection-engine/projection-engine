import ActionHistoryAPI from "../../../libs/ActionHistoryAPI";

export default function updateEntityScript(savedState, setSaved, entity, index, key, value, save){

        if(!savedState){
            ActionHistoryAPI.saveEntity(
                entity.id,
                index,
                key,
                value
            )
            setSaved(true)
        }
        entity.scripts[index][key] = value
        if(save)
            ActionHistoryAPI.saveEntity(
                entity.id,
                index,
                key,
                value
            )

}