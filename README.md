# cosmocam

cosmocam is a free pet cam web service! It supports video streams from multiple webcams that can be viewed either on a computer or mobile device.

## tech

I used the following libraries / frameworks for the frontend:

- React for updating the DOM
- Framer Motion for any animations
- Material UI for the pre-designed components
- WebRTC for streaming video to the server
- WebRTC for receiving streaming data from the server to display
- Socket IO for signalling WebRTC connection information

I used the following libraries for the backend:

- NodeJS / ExpressJS for the server
- WebRTC for receiving streaming data from clients and for sending video stream data back to clients
- Socket IO for adding IceCandidates to WebRTC peer connections
- Socket IO for signalling the WebRTC connection information
- bcrypt for hashing passwords

## functionality

In the application, users can create a new account that can be logged into from multiple computers. Webcam video can be streamed from one of the streaming computers, which will send streaming data to the server. Each stream can then be viewed from a viewing device, which could be another computer or a mobile device.

The multi-streaming functionality allows a user to set up multiple camera angles within their house or apartment so they can track their pet as they move around!
