#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// WiFi credentials
const char SSID = "MyAltice 5dfde7";
const char PASS = "4563-amber-26";

// Create an instance of the server
AsyncWebServer server(80);

// Define the pin collection
const int pinCollection[] = {2, 4, 5}; // Add your pins here
const int numPins = sizeof(pinCollection) / sizeof(pinCollection[0]);

// Function to get pin status
String getPinStatus() {
  String status = "{";
  for (int i = 0; i < numPins; i++) {
    int pin = pinCollection[i];
    pinMode(pin, INPUT);
    status += "\"Pin " + String(pin) + "\": " + String(digitalRead(pin));
    if (i < numPins - 1) {
      status += ", ";
    }
  }
  status += "}";
  return status;
}

// Setup WiFi
void setupWiFi() {
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

// Setup server and endpoints
void setupServer() {
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "application/json", getPinStatus());
  });

  server.begin();
}

void setup() {
  Serial.begin(115200);
  setupWiFi();
  setupServer();
}

void loop() {
  // Nothing to do here
}
