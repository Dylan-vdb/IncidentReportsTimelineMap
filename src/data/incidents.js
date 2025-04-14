// Mock incident data for Eastern Cape
const incidents = [
  {
    id: 1,
    name: 'Traffic Accident - N2 Highway',
    location: [26.8813, -32.9940],
    datetime: '2024-01-23T08:30:00',
    image: 'https://picsum.photos/id/1/200/200',
    severity: 4
  },
  {
    id: 2,
    name: 'Power Outage - East London CBD',
    location: [27.9116, -32.9834],
    datetime: '2024-01-19T16:45:00',
    image: 'https://picsum.photos/id/2/200/200',
    severity: 3
  },
  {
    id: 3,
    name: 'Water Main Break - Port Elizabeth',
    location: [25.6022, -33.9608],
    datetime: '2024-01-16T11:20:00',
    image: 'https://picsum.photos/id/3/200/200',
    severity: 3
  },
  {
    id: 4,
    name: 'Storm Damage - Mthatha',
    location: [28.7749, -31.5889],
    datetime: '2024-01-12T19:15:00',
    image: 'https://picsum.photos/id/4/200/200',
    severity: 5
  },
  {
    id: 5,
    name: 'Fire Incident - Grahamstown',
    location: [26.5333, -33.3142],
    datetime: '2024-01-09T14:50:00',
    image: 'https://picsum.photos/id/5/200/200',
    severity: 5
  },
  {
    id: 6,
    name: 'Road Closure - Queenstown',
    location: [26.8753, -31.8976],
    datetime: '2024-01-05T09:25:00',
    image: 'https://picsum.photos/id/6/200/200',
    severity: 2
  },
  {
    id: 7,
    name: 'Protest Action - King William\'s Town',
    location: [27.3939, -32.8864],
    datetime: '2024-01-02T13:40:00',
    image: 'https://picsum.photos/id/7/200/200',
    severity: 1
  },
  {
    id: 8,
    name: 'Building Collapse - Butterworth',
    location: [28.1447, -32.3272],
    datetime: '2023-12-29T10:15:00',
    image: 'https://picsum.photos/id/8/200/200',
    severity: 5
  },
  {
    id: 9,
    name: 'Flooding - Port Alfred',
    location: [26.8915, -33.5906],
    datetime: '2023-12-26T17:30:00',
    image: 'https://picsum.photos/id/9/200/200',
    severity: 4
  },
  {
    id: 10,
    name: 'Industrial Accident - Coega',
    location: [25.6741, -33.7761],
    datetime: '2023-12-23T15:20:00',
    image: 'https://picsum.photos/id/10/200/200',
    severity: 4
  },
  {
    id: 11,
    name: 'Railway Disruption - Cradock',
    location: [25.6199, -32.1642],
    datetime: '2023-12-20T12:10:00',
    image: 'https://picsum.photos/id/11/200/200',
    severity: 3
  },
  {
    id: 12,
    name: 'Bridge Damage - Lady Frere',
    location: [27.2328, -31.7036],
    datetime: '2023-12-17T08:45:00',
    image: 'https://picsum.photos/id/12/200/200',
    severity: 4
  },
  {
    id: 13,
    name: 'Gas Leak - Uitenhage',
    location: [25.4019, -33.7642],
    datetime: '2023-12-14T16:55:00',
    image: 'https://picsum.photos/id/13/200/200',
    severity: 4
  },
  {
    id: 14,
    name: 'School Emergency - Fort Beaufort',
    location: [26.6307, -32.7827],
    datetime: '2023-12-11T11:35:00',
    image: 'https://picsum.photos/id/14/200/200',
    severity: 3
  },
  {
    id: 15,
    name: 'Medical Emergency - Graaff-Reinet',
    location: [24.5308, -32.2522],
    datetime: '2023-12-08T14:25:00',
    image: 'https://picsum.photos/id/15/200/200',
    severity: 3
  },
  {
    id: 16,
    name: 'Vehicle Pile-up - Aliwal North',
    location: [26.7145, -30.6971],
    datetime: '2023-12-31T18:40:00',
    image: 'https://picsum.photos/id/16/200/200',
    severity: 4
  },
  {
    id: 17,
    name: 'Power Station Failure - Somerset East',
    location: [25.5866, -32.7227],
    datetime: '2023-12-30T20:15:00',
    image: 'https://picsum.photos/id/17/200/200',
    severity: 4
  },
  {
    id: 18,
    name: 'Chemical Spill - Kirkwood',
    location: [25.4419, -33.4037],
    datetime: '2023-12-29T09:50:00',
    image: 'https://picsum.photos/id/18/200/200',
    severity: 5
  },
  {
    id: 19,
    name: 'Structural Fire - Adelaide',
    location: [26.2988, -32.7027],
    datetime: '2023-12-28T13:05:00',
    image: 'https://picsum.photos/id/19/200/200',
    severity: 4
  },
  {
    id: 20,
    name: 'Public Transport Incident - Mdantsane',
    location: [27.7608, -32.9477],
    datetime: '2023-12-27T15:30:00',
    image: 'https://picsum.photos/id/20/200/200',
    severity: 3
  },
  {
    id: 21,
    name: 'Construction Site Accident - Bhisho',
    location: [27.4419, -32.8476],
    datetime: '2023-12-26T11:45:00',
    image: 'https://picsum.photos/id/21/200/200',
    severity: 4
  },
  {
    id: 22,
    name: 'Mall Emergency - Gonubie',
    location: [28.0266, -32.9363],
    datetime: '2023-12-25T17:20:00',
    image: 'https://picsum.photos/id/22/200/200',
    severity: 2
  },
  {
    id: 23,
    name: 'Airport Incident - East London Airport',
    location: [27.8253, -33.0364],
    datetime: '2023-12-24T10:55:00',
    image: 'https://picsum.photos/id/23/200/200',
    severity: 3
  },
  {
    id: 24,
    name: 'Hospital Emergency - Port Elizabeth',
    location: [25.5977, -33.9471],
    datetime: '2023-12-23T14:40:00',
    image: 'https://picsum.photos/id/24/200/200',
    severity: 4
  },
  {
    id: 25,
    name: 'Beach Incident - Jeffreys Bay',
    location: [24.9275, -34.0507],
    datetime: '2023-12-22T12:30:00',
    image: 'https://picsum.photos/id/25/200/200',
    severity: 2
  },
  {
    id: 26,
    name: 'Stadium Emergency - Nelson Mandela Bay',
    location: [25.5889, -33.9351],
    datetime: '2023-12-21T19:45:00',
    image: 'https://picsum.photos/id/26/200/200',
    severity: 3
  },
  {
    id: 27,
    name: 'Mining Incident - Steynsburg',
    location: [25.8219, -31.2971],
    datetime: '2023-12-20T08:15:00',
    image: 'https://picsum.photos/id/27/200/200',
    severity: 4
  },
  {
    id: 28,
    name: 'Dam Overflow - Maclear',
    location: [28.3097, -31.0696],
    datetime: '2023-12-19T16:35:00',
    image: 'https://picsum.photos/id/28/200/200',
    severity: 5
  },
  {
    id: 29,
    name: 'Forest Fire - Hogsback',
    location: [26.9346, -32.5946],
    datetime: '2023-12-18T15:10:00',
    image: 'https://picsum.photos/id/29/200/200',
    severity: 5
  },
  {
    id: 30,
    name: 'Agricultural Emergency - Bedford',
    location: [26.0833, -32.6833],
    datetime: '2023-12-17T11:25:00',
    image: 'https://picsum.photos/id/30/200/200',
    severity: 2
  }
];

export default incidents;