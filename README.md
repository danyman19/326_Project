Akhila Garre - garreakhila
Daniel Qi - danyman19
Mai Le - mainle-git

Working agreement:

- "Done" for a PR means at least one member of the group approved it.
- Communication: We have exchanged numbers, so we will communicate through iMessage
- Splitting work: Before each assignment we will divy up the work through IMessage
- Disagreements: We will make sure to work through any disagreements professionally and stay open-minded through our conversations and will communicate our thoughts.

# What is Syllabus-to-Calendar Parser?

Syllabus-to-Calendar Parser is a tool that allows users to copy and paste text from a course syllabus. The application uses string processing or a lightweight API to identify important due dates and display them in a custom, interactive dashboard calendar.

# Design Decision:

### Akhila Garre
#### Decision: Service-layer validation
I decided to place the event validation in the service layer rather than the controller or repository. I contemplated keeping the validation in the controller layer as well as it could validate incoming requests but I felt like it would mix business rules with HTTP request handling and make it more complicated to reuse those rules. Even if I had enforced the validation in the repository, it would also mix the validation logic with file storage responsibilites. By keeping the validation in the service layer, we can enforce consistent rules before events are saved regardless of how the service is called.  This way it is also easier to test and maintain the code for the future if we ever decide to change how events are stored or add ways to create events. In the end, we decided to keep the validation checks in the services layer because it helps format everything for the repository and the services layer will check formatting and own the rules. The repository layer is kept just for receiving informaition, not checking for formatting. Now the files are all organized separately where the controller will handle requests and responses, the service validates event rules and the repository will read and write events.json. 


## Setup

### 1. Clone the repository

```bash
git clone https://github.com/danyman19/326_Project.git
cd 326_Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

### 4. Open app

Go to

```text
http://localhost:3000
```
