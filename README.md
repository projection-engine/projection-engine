## v2.4.0-Alpha

### Additions:
- Skybox added to rendering pipeline
- Entity mapping for easy query inside scripts
- Added warning and error logs for console

### Reworks:
- Outline and gizmo rendering pipeline
- Viewport and editor preferences added to preferences window
- Editor background color added to preferences window
- Script loading now loads after engine entered execution mode
- Console and debugging:
    -  Visual rework for console
    - Debug class now accessible inside scripts
    - warning and errors
    - Log source
    - Infinite scroll added to console
    - Object information instead of JSON string

### Fixes:
- Rotation gizmo picking.
- Outline drawing over gizmo
- Shader editor:
    - Dragging new nodes
    - Linking nodes
    - Material node not saving render type attributes

## Screenshots
<table>
    <tr>
        <th>
            Console
        </th>
        <th>
            Preferences
        </th>
    </tr>
    <tr>
        <td>
            <img src="https://github.com/projection-engine/.github/blob/main/v2.4.0-alpha/console.png?raw=true" alt="Console"/>
        </td>
        <td>
            <img src="https://github.com/projection-engine/.github/blob/main/v2.4.0-alpha/background.png?raw=true" alt="Background"/>                                                             
        </td>
    </tr>
<tr>
        <th> 
           Entity mapping 
        </th>
        <th>
            Multiple views and shader editor
        </th>
    </tr>
    <tr>
        <td>
         <img src="https://github.com/projection-engine/.github/blob/main/v2.4.0-alpha/entity-query.png?raw=true" alt="Query"/>
        </td>
        <td><img src="https://github.com/projection-engine/.github/blob/main/v2.4.0-alpha/skybox-material.png?raw=true" alt="Shader Editor"/></td>
    </tr>
</table>