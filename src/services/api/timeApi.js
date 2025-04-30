// const url = 'https://timeapi.io/api/timezone/zone?timeZone=Asia%2FYekaterinburg';

const key = 'Dn7VcIlyD21crN9489hG+g==l7xwzefxZkYFHbmR';
const timezone = 'Asia/Yekaterinburg';
const url = `https://api.api-ninjas.com/v1/worldtime?timezone=${timezone}`;

export async function CurrentTime() {
    return await sendGet();
}

async function sendGet() {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': key
            }
        });
        return await response.json();
    } catch (error) {
        console.log('Ошибка в получении даты: ', error.message);
    }
}