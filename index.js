const { gql, ApolloServer } = require("apollo-server");
const {
    ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { events, locations, participants, users } = require("./data.json");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    events:[Event!]!
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }

  type Event {
    id: ID!
    title: String!
    desc: String!
    date:String!
    from:String!
    to:String!
    location_id:ID!
    user_id:ID!
    user:User!
    location:Location!
    participants:[Participant!]!
  }

  type Query {
    user(id:ID!):User
    users:[User!]!
    event(id:ID!):Event
    events:[Event!]!
    location(id:ID!):Location
    locations:[Location!]!
    participant(id:ID!):Participant
    participants:[Participant!]!
  }
`;

const resolvers = {
    Query: {
        user: (_, args) => users.find(u => u.id === +args.id),
        users: () => users,

        event: (_, args) => events.find(e => e.id === +args.id),
        events: () => events,

        location: (_, args) => locations.find(l => l.id === +args.id),
        locations: () => locations,

        participant: (_, args) => participants.find(p => p.id === +args.id),
        participants: () => participants
    },
    User: {
        events: (parent) => events.filter(e => e.user_id === parent.id)
    },
    Event: {
        user: (parent) => users.find(u => u.id === parent.user_id),
        location: (parent) => locations.find(l => l.id === parent.location_id),
        participants: (parent) => participants.filter(p => p.event_id === parent.id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

server.listen().then(({ url }) => console.log(`Listening on  ${url}`));
