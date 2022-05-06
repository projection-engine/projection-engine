import {v4} from "uuid";
export const CLOSE_CHANNEL ='close-project'
export default function openProject(projectID) {
   return {
       channel: 'create-project-window',
       data: {
           closeEvent: 'close-project',
           windowID: v4().toString(),
           data: projectID,
           channel:  'on-start-project'
       }
   }
}