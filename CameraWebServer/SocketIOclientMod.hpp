// https://stackoverflow.com/a/72560866/3899847
#include <WebSocketsClient.h>
#include <SocketIOclient.h>

class SocketIOclientMod : public SocketIOclient
{
public:
  bool sendBIN(uint8_t *payload, size_t length, char const* eventName, char const* hostName, bool headerToPayload = false); //char *hostname, 
};
