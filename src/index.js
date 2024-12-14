import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './assets/styles/main.css';
import { miniApp, mockTelegramEnv, parseInitData } from '@telegram-apps/sdk';
import { authorizationTelegram } from '../src/services/api/send.js';


const initializeTelegramSDK = async () => {
    try {
        // Попытка инициализировать настоящее окружение Telegram
        console.log("Инициализация окружения Telegram");
        if (miniApp.mount.isAvailable()) {
            miniApp.mount();
            miniApp.isMounted(); // true
        }
    } catch (error) {
        // В случае ошибки инициализируем фейковое окружение
        console.error('Ошибка при инициализации Telegram:', error);

        const initDataRaw = new URLSearchParams([
            ['user', JSON.stringify({
                id: 99281932,
                first_name: 'Andrew',
                last_name: 'Rogue',
                username: 'rogue',
                language_code: 'en',
                is_premium: true,
                allows_write_to_pm: true,
            })],
            ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
            ['auth_date', '1716922846'],
            ['start_param', 'debug'],
            ['chat_type', 'sender'],
            ['chat_instance', '8428209589180549439'],
        ]).toString();

        mockTelegramEnv({
            themeParams: {
                accentTextColor: '#6ab2f2',
                bgColor: '#17212b',
                buttonColor: '#5288c1',
                buttonTextColor: '#ffffff',
                destructiveTextColor: '#ec3942',
                headerBgColor: '#fcb69f',
                hintColor: '#708499',
                linkColor: '#6ab3f3',
                secondaryBgColor: '#232e3c',
                sectionBgColor: '#17212b',
                sectionHeaderTextColor: '#6ab3f3',
                subtitleTextColor: '#708499',
                textColor: '#f5f5f5',
            },
            initData: parseInitData(initDataRaw),
            initDataRaw,
            version: '7.2',
            platform: 'tdesktop',
        });

        console.log('Mock Telegram environment initialized');
    }
};

initializeTelegramSDK();

const container = document.getElementById('root');
const root = createRoot(container);

const urlParams = new URLSearchParams(window.location.search);
const tgUserId = urlParams.get('userId');
//console.log('ид из телеги', tgUserId);
//if (!tgUserId) {
//    root.render(
//        <div>Нет доступа к журналу.</div>
//    );
//}

(async () => {
    try {
        const data = tgUserId ? await authorizationTelegram(tgUserId) : null;
        let groupId = data ? (JSON.parse(JSON.stringify(data))).id_group : 5;
        let isHeadman = data ? true : false;
        //console.log(isHeadman);

        root.render(
            <App groupId={groupId} isHeadman={isHeadman} />
        );
    }
    catch (e) {
        console.error('Ошибка при получении группы: ', e.message);
    }
})();