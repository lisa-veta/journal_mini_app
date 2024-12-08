const url = 'https://timeapi.io/api/timezone/zone?timeZone=Asia%2FYekaterinburg';

export async function CurrentTime() {
    return await sendGet();
}

async function sendGet() {
    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        return await response.json();
    } catch (error) {
        console.log('Ошибка в получении даты: ', error.message);
    }
}