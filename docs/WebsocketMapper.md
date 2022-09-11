# Communication to WebsocketGaugeServer

## Calling websocket communication client from gauge application class

## Use websocket client
### Case 1 : Use websocket client through WebsocketClientMapper (recommend)
From Version 3.0, new features of `WebsocketClientMapper` is available. 
`WebsocketClientMapper` receives communication request from gauge application class, and distrubute to each websocket client classes following pre-defined mapping settings.

Using `WebsocketClientMapper` has follwing benefits,
* Gauge application class 
```mermaid
    graph TD
        subgraph "jsClient(@browser)"
        G[Gauge appllication class] --> |Rev, Speed,Manifold Pres.,Coolant Temp.|A
        A[WebsocketClientMapper] -.- |"(Disabled)"| B[DefiWebSocketClient]
        A -.- |"(Disabled)"| C[SSMWebSocketClient]
        A ==> |Coolant Temp., Speed| D[ELM327WebSocketClient]
        A ==> |Rev,Manifold Pres.| E[ArduinoWebSocketClient]
        end
        subgraph C# server
        B -.- |"(Disabled)"|B2[DefiWebSocketServer]
        C -.- |"(Disabled)"|C2[SSMWebSocketServer]
        D ==> |Websocket|D2[ELM327WebSocketServer]
        E ==> |Websocket|E2[ArduinoWebSocketServer]
        end
        B2 -.- B3[Defi control unit]
        C2 -.- C3[ECU with SSM protocol]
        D2 ==> D3[ECU with OBDII]
        E2 ==> E3[Arudino Uno board]
```


```mermaid
    graph TD
        subgraph "jsClient(@browser)"
        A[Gauge appllication class] -.- |"(Disabled)"| B[DefiWebSocketClient]
        A -.- |"(Disabled)"| C[SSMWebSocketClient]
        A ==> |Coolant Temp., Speed|D[ELM327WebSocketClient]
        A ==> |Rev,Manifold Pres.| E[ArduinoWebSocketClient]
        end
        subgraph C# server
        B -.- |"(Disabled)"|B2[DefiWebSocketServer]
        C -.- |"(Disabled)"|C2[SSMWebSocketServer]
        D ==> |Websocket|D2[ELM327WebSocketServer]
        E ==> |Websocket|E2[ArduinoWebSocketServer]
        end
        B2 -.- B3[Defi control unit]
        C2 -.- C3[ECU with SSM protocol]
        D2 ==> D3[ECU with OBDII]
        E2 ==> E3[Arudino Uno board]
```
