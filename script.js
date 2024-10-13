// Replace with your API key and endpoint
const API_KEY = 'GET YOUR TOKEN';
const BRACKET_ENDPOINT = 'https://api.start.gg/gql/alpha'; // example endpoint

const query_info = `
query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) {
  event(id: $eventId) {
    id
    name
    sets(
      page: $page
      perPage: $perPage
      sortType: STANDARD
    ) {
      pageInfo {
        total
      }
      nodes {
        id
        slots {
          id
          entrant {
            id
            name
          }
        }
      }
    }
  }
}`;

const query_vars = {
    eventId: 1224551,
    page: 1,
    perPage: 10
};

// Function to fetch the bracket and update the box
async function fetchBracket() {
    try {
        const response = await fetch(BRACKET_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ query: query_info, variables: query_vars })
        });

        const data = await response.json();

        console.log(data);

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        // Display the tournament name and event names in the bracket box
        const event = data.data.event;
        const bracketBox = document.getElementById('bracket-box');
        let bracketContent = `Tournament: ${event.name}<br><br>`;

        event.sets.nodes.forEach(node => {
            bracketContent += `${node.slots[0].entrant.name} vs ${node.slots[1].entrant.name}<br>`;
        });

        bracketBox.innerHTML = bracketContent;
    } catch (error) {
        document.getElementById('bracket-box').innerText = `Error: ${error.message}`;
    }
}

// Add click event listener to the button
document.getElementById('fetch-button').addEventListener('click', fetchBracket);
