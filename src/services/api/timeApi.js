// Захардкодил для получения нашего времени, думаю, пока не важно
const url = 'https://timeapi.io/api/timezone/zone?timeZone=Asia%2FYekaterinburg';

export async function CurrentTime() {
    return await sendGet();
}

async function sendGet() {
    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log('Ошибка в получении даты: ', error.message);
    }
}