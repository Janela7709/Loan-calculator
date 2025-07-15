/* 
    სესხის კალკულატორის ლოგიკა
    ავტორი: ChatGPT
    ყველა კომენტარი ქართულად
*/

// ფორმის და ელემენტების არჩევა
const form = document.getElementById('loan-form');
const errorMessage = document.getElementById('error-message');

const monthlyPaymentEl = document.getElementById('monthly-payment');
const totalPaymentEl = document.getElementById('total-payment');
const totalInterestEl = document.getElementById('total-interest');
const amortizationTable = document.getElementById('amortization-table').getElementsByTagName('tbody')[0];

// ფორმის გაგზავნის (submit) ივენთის დამუშავება
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // შეცდომის შეტყობინების გასუფთავება
    errorMessage.textContent = '';

    // შეყვანილი მონაცემების წაკითხვა
    const amount = parseFloat(document.getElementById('amount').value);
    const annualInterest = parseFloat(document.getElementById('interest').value);
    let term = parseInt(document.getElementById('term').value);
    const termUnit = document.getElementById('term-unit').value;

    // ვადის გადაყვანა თვეებში
    if (termUnit === 'years') {
        term = term * 12;
    }

    // ვალიდაციის შემოწმება
    if (isNaN(amount) || amount <= 0 || isNaN(annualInterest) || annualInterest < 0 || isNaN(term) || term <= 0) {
        errorMessage.textContent = 'გთხოვთ შეიყვანოთ სწორი დადებითი მნიშვნელობები.';
        return;
    }

    // გამოთვლა
    const monthlyInterestRate = (annualInterest / 100) / 12;
    let monthlyPayment;

    if (monthlyInterestRate === 0) {
        // პროცენტი 0-ის შემთხვევაში
        monthlyPayment = amount / term;
    } else {
        // ანუიტეტური ფორმულა
        const x = Math.pow(1 + monthlyInterestRate, term);
        monthlyPayment = amount * monthlyInterestRate * x / (x - 1);
    }

    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;

    // შედეგების ჩვენება
    monthlyPaymentEl.textContent = monthlyPayment.toFixed(2);
    totalPaymentEl.textContent = totalPayment.toFixed(2);
    totalInterestEl.textContent = totalInterest.toFixed(2);

    // ამორტიზაციის ცხრილის გენერაცია
    generateAmortizationTable(amount, monthlyInterestRate, monthlyPayment, term);
});

/*
    ამორტიზაციის ცხრილის გენერირების ფუნქცია
*/
function generateAmortizationTable(principal, monthlyRate, monthlyPayment, term) {
    // ცხრილის გასუფთავება
    amortizationTable.innerHTML = '';

    let balance = principal;

    for (let i = 1; i <= term; i++) {
        let interestPayment = balance * monthlyRate;
        let principalPayment = monthlyPayment - interestPayment;

        // პროცენტი 0-ის შემთხვევაში
        if (monthlyRate === 0) {
            interestPayment = 0;
            principalPayment = monthlyPayment;
        }

        balance -= principalPayment;
        if (balance < 0) balance = 0;

        // ახალი რიგის დამატება
        const row = amortizationTable.insertRow();
        row.insertCell(0).textContent = i;
        row.insertCell(1).textContent = monthlyPayment.toFixed(2);
        row.insertCell(2).textContent = interestPayment.toFixed(2);
        row.insertCell(3).textContent = principalPayment.toFixed(2);
        row.insertCell(4).textContent = balance.toFixed(2);
    }
}
