🌍 CharityDAO
=============

Welcome to [CharityDAO](https://charity-dao-1.vercel.app/), where blockchain technology meets philanthropy to create a transparent and impactful platform for charitable donations. By leveraging the XRPL (XRP Ledger) and ZK-proof technology via Sismo Connect, CharityDAO ensures each contribution is meaningful, transparent, and directly supports countries in global crises situations. 

🎥 Video Walkthrough
------------------

Watch it on [Youtube](https://www.youtube.com/watch?v=5NlxoAPjttU)

🔐 Getting Started
------------------

To get started with CharityDAO, follow these steps:

### 🛠 Installation

1.  Clone the repository:

    `git clone https://github.com/selcukemiravci/CharityDAO.git`

2.  Navigate to the project directory:

    `cd CharityDAO`

3.  Install dependencies:

    `npm install xrpl @mui/material @emotion/react @emotion/styled @sismo-core/sismo-connect-react`


5.  Start the application:

    `npm start`

    This command runs the app in development mode. Open [http://localhost:3000](http://localhost:3000/) to view it in the browser or simply visit the live [deployment](https://charity-dao-1.vercel.app/).

🗳️ How to Use
--------------

1.  Visit: Head over to [CharityDAO](https://charity-dao-1.vercel.app/) and discover a platform where your vote directly contributes to global charitable causes.

2.  Authenticate: Confirm your humanity with Sismo Connect's ZK-proof to ensure a secure and legitimate voting process.

3.  Connect: Enter your XRPL testnet wallet seed to connect your wallet securely. Acquire a testnet seed from the [XRP Testnet Faucet](https://xrpl.org/xrp-testnet-faucet.html) if needed.

4.  Donate: Select the countries you wish to support and specify your donation amounts. Submit to add your tentative votes.

5.  Review: Before confirming your transactions, a live-time voting receipt is presented, allowing you to see and adjust your contributions.

6.  Confirm: Upon confirmation, transactions are processed, and you receive a TXid for each vote, which can be verified on <https://testnet.xrpl.org/>.

🚀 Key Features
---------------

-   Sismo Authentication: Ensures genuine participation with ZK-based & wallet authentication.
-   Transparent Voting: Real-time donation with a tentative voting receipts, TXid and more for transparency.
-   Fast Donation Transfer: Utilizes XRPL for fast and scalable donation transfer to the chosen countries.
-   Wallet Balance: Real-time account balance update with the wallet connection.

🧰 Technologies
---------------

CharityDAO is built using a robust stack:

-   ReactJS
-   Next.js
-   TypeScript
-   JavaScript
-   XRPL (XRP Ledger)
-   Sismo Connect

👀 Future Implementations
---------------

In the future iterations of CharityDAO, to fulfill its vision, donors will have the opportunity to select the charities within each country to which the funds will be allocated. This selection process will also take place within a DAO (Decentralized Autonomous Organization) structure, where the weight of each user's vote is determined by the amount they have donated. This will ensure that the funds are allocated to the charities that the donors believe will have the most impact. This functionality can be implemented via creating a data-vault, through [Sismo Connect](https://docs.sismo.io/sismo-docs/data-groups/tutorials/create-your-group-generator#creation-of-the-group-generator). Each group can have a voting power, based on their donations and the DAO can be used to vote on the charities.

Example:
- "1" --> get 1 voting power
- "2" --> get 50 voting power
- "3" --> get 500 voting power

✍️ Credits
----------

Originally prototyped at ETHWaterloo, CharityDAO has evolved under [Emir Avci's](https://github.com/selcukemiravci) vision, merging decentralized voting with philanthropy.

📜 License
----------

This project is open-sourced under the [MIT license](https://github.com/selcukemiravci/CharityDAO/blob/main/LICENSE).
