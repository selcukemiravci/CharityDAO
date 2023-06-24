// Initialize the client
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

// UI Elements
const destinationInput = document.getElementById('destination')
const amountInput = document.getElementById('amount')
const submitButton = document.getElementById('submit')
const statusParagraph = document.getElementById('status')

async function main() {
    // Connect to the client
    await client.connect()

    // Replace this with your actual seed
    const wallet = xrpl.Wallet.fromSeed("sEdTDrA92JzRNCg1EjsZCBjn5MXiWqB")

    // Submit button click event
    submitButton.addEventListener('click', async () => {
        // Disable the button to prevent multiple submissions
        submitButton.disabled = true

        // Get the values from the input fields
        const destination = destinationInput.value
        const amount = amountInput.value

        // Prepare the transaction
        const prepared = await client.autofill({
            "TransactionType": "Payment",
            "Account": wallet.address,
            "Amount": xrpl.xrpToDrops(amount), // Converts from XRP to drops
            "Destination": destination
        })

        // Sign the transaction
        const signed = wallet.sign(prepared)

        // Submit the transaction
        const prelimResult = await client.submit(signed.tx_blob)

        statusParagraph.textContent = 'Transaction submitted, preliminary result: ' + prelimResult.resultCode

        // Wait for validation
        client.request({
            command: 'subscribe',
            accounts: [wallet.address]
        })

        client.on('transaction', (tx) => {
            if (tx.transaction.hash === signed.hash) {
                statusParagraph.textContent += '\nTransaction validated, final result: ' + tx.validated
                // Unsubscribe when we're done.
                client.request({
                    command: 'unsubscribe',
                    accounts: [wallet.address]
                })
            }
        })

        // Enable the button again
        submitButton.disabled = false
    })
}

main()
