const d = document,
$amount = d.querySelector('input'),
$changeBtn = d.querySelector('.change-icon'),
$selects = d.querySelectorAll('select'),
$convertBtn = d.querySelector('button'),
$result = d.querySelector('.result');
let apiKey = '4717a11d37204e93a4679997';


// setTimeout(()=>{
//     console.log($amount.value)
// },2000)

async function getCurrency () {
    try {
        const res = await fetch('https://v6.exchangerate-api.com/v6/4717a11d37204e93a4679997/codes')

        if(!res.ok) throw { status: res.status, statusTxt: res.statusText }
        const data = await res.json();
        console.log(data)

        let arr = data['supported_codes'];
        let $fragment = d.createDocumentFragment();

        arr.forEach(el => {
            let option = d.createElement('option');
            option.value = el[0];
            option.textContent = `${el[0]} (${el[1]})`;
            
            $fragment.appendChild(option)
        });
        let clone = $fragment.cloneNode(true);
        $selects[1].appendChild($fragment);
        $selects[0].appendChild(clone);

    } catch (error) {
        let msg = error.statusText || 'Ocurrió un error';
        console.log(`Error ${error.status}: ${msg}`);
        $result.innerHTML = `Error ${error.status}: ${msg}`;
    }
}


async function getConversion(amount ,base, target){
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base}/${target}/${amount}`);
        if(!res.ok) throw { status: res.status, statusTxt: res.statusText }
        const data = await res.json();

        console.log(data);
        $result.innerText = `${amount} ${data.base_code} = ${data.conversion_result.toFixed(2)} ${data.target_code}`;
    } catch (error) {
        let msg = error.statusText || 'Ocurrió un error';
        console.log(`Error ${error.status}: ${msg}`);
        $result.innerHTML = `Error ${error.status}: ${msg}`;
    }
}


d.addEventListener('DOMContentLoaded', getCurrency);

$changeBtn.addEventListener('click', () => {
    const firstValue = $selects[0].value,
    secondValue = $selects[1].value;

    $selects[0].value = secondValue;
    $selects[1].value = firstValue;
})

$convertBtn.addEventListener('click', e => {
    let value = $amount.value;
    console.log(value)
    if(!value) {
        $result.innerHTML = '<p class="error">The amount must be a number!</p>';
    } else if(value.length > 30){
        $result.innerHTML = '<p class="error">Amount Out of Range</p>';
    } else if(value.includes('-')) {
        $amount.value = value.replace('-','');
        $result.innerHTML = '<p class="error">Amount must be Positive</p>';
    } else {
        getConversion(value, $selects[0].value, $selects[1].value)
    }
});


