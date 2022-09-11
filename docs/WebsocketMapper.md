# Communication to WebsocketGaugeServer

## Calling websocket communication client from gauge application class

## Use websocket client
### Case 1 : Use websocket client through WebsocketClientMapper (recommend)
From Version 3.0, new features of `WebsocketClientMapper` is available. 
`WebsocketClientMapper` receives communication request from gauge application class, and distrubute to each websocket client classes following pre-defined mapping settings.

Using `WebsocketClientMapper` has follwing benefits,
* Gauge application class do not need to aware which kind of websocket client/server (ECU procotol) is used.
* Not necessary to re-write gauge application class to change websocket client/server (ECU procotol).
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

### Case 2 : Use each websocket client class directly
It is also possible to use each websocket client classes directly, without using `WebsocketMapper`.
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
