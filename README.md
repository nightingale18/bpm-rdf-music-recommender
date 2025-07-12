<h3 align="center" style="margin: 30px 0 35px;">IoT Music Recommender App</h3>

![alt text](https://github.com/nightingale18/iot-music-recommender/blob/main/demo/output_view.png?raw=true)


## Features
- High interoperability
- Suitable for multiple devices by implemented W3C Thing Descriptions principles
- Complete documentation and examples
- Demo

## Idea
Implement a Solid app with a music player and make it possible to work with all IoT devices which handle a heartbeat value.

## Install dependencies
```

npm install
cd client && npm install
```

## Use
### Step one： expose a Thing which simulates an average heart beat per minute
```
node simulator_server/server.js
```

### Step two： start a client server
```
cd client && npm run serve
```

### Step three： start a solid server by adding a data folder from our project to a solid one and run server
```

npx @solid/community-server -c @css:config/file.json -f data/
```
### Step four: enter URI description, e.g. `http://localhost:3001/ThingDescription`

![alt text](https://github.com/nightingale18/iot-music-recommender/blob/main/demo/start_view.png?raw=true)


### Demo

[Demo](https://github.com/nightingale18/iot-music-recommender/blob/main/demo/demo_1%3A00.mp4) is provided to demonstrate the work of the application.

### Implemented phases

1. a function, which simulates a human’s heart rate, provided by a server;
2. a client-side of the server via Vue.js to display the current heart rate value;
3. an infinite heartbeat simulator: “expose a Thing” on the server-side and “consume a Thing” on the client-side;
4. the knowledge graph to perform a lookup operation;
5. a Solid application with SPARQL-supported server, which perform local queries’ calculations;
6. a audio player component;
7. an input field for fetching a device URI: to fully demonstrate adaptability towards other IoT devices.

### Next steps:

- enhance the TD by providing the  `properties` and  `actions` property description to make our simulator stoppable by some button;
- use a different pod provider, e.g. Inrupt Pod Spaces;
- implement Authentication and Authorization systems, and grant access to pods;
- test with different IoT devices.



## The following RDF graphs where constructed via a <a href="https://www.ldf.fi/service/rdf-grapher"> rdf-grapher tool </a>
### RDF graph for own ontology from `music.ttl`

![alt text](https://github.com/nightingale18/iot-music-recommender/blob/main/png/rdf-graph-music.png?raw=true)

### RDF graph with `music` instances from `music_data.ttl`

![alt text](https://github.com/nightingale18/iot-music-recommender/blob/main/png/rdf-graph-music-data.png?raw=true)

## License
`MIT`
