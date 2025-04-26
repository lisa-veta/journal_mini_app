import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './assets/styles/main.css';
import { mockTelegramEnv, init } from '@telegram-apps/sdk';
import {
    disableVerticalSwipes,
    mountSwipeBehavior,
    isSwipeBehaviorSupported
} from '@telegram-apps/sdk';
import { incrementOpenMiniapp } from './services/api/send';
import '@gravity-ui/uikit/styles/styles.css';
import { TrackGroups, TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';
import {Provider} from 'react-redux';
import { store } from './services/store/store';

const initializeTelegramSDK = async () => {
    try {
        await init();
        console.log("Инициализация Telegram SDK");
        await initializeSwipeBehavior();
    } catch (error) {
        console.warn("Не удалось инициализировать Telegram SDK. Используем mock окружение:", error);
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
            initData: initDataRaw,
            initDataRaw,
            version: '7.2',
            platform: 'tdesktop',
        });

        console.log("Mock Telegram environment initialized");

        await initializeSwipeBehavior(); // Не забываем инициализировать свайпы даже в mock
    }
};

const initializeSwipeBehavior = async () => {
    try {
        if (!isSwipeBehaviorSupported()) {
            console.warn('Swipe behavior not supported');
            return;
        }

        if (mountSwipeBehavior.isAvailable()) {
            mountSwipeBehavior();
        }

        if (disableVerticalSwipes.isAvailable()) {
            disableVerticalSwipes();
            console.log('Свайпы вниз отключены');
        }
    } catch (error) {
        console.error('Ошибка при инициализации свайпов:', error);
    }
};

initializeTelegramSDK();

const container = document.getElementById('root');
const root = createRoot(container);

const urlParams = new URLSearchParams(window.location.search);
let tgUserId = urlParams.get('userId');
//тест студента(я)
// tgUserId = 1789426376;
//для тестов препода (барабанщиков)
// tgUserId = 1345;

if (!tgUserId) {
    root.render(<div>Нет доступа к журналу.</div>);
} else {
    (async () => {
        await incrementOpenMiniapp(tgUserId);
    })();

    root.render(
        <TwaAnalyticsProvider
            projectId="2e95c213-e47f-4e23-9bb6-9c5e355c5a8e"
            apiKey="a122e626-05d9-49d1-9e4c-9ebd7f23aa46"
            trackGroup={TrackGroups.MEDIUM}
        >
            <Provider store={store}>
                <App telegramId={tgUserId} />
            </Provider>
        </TwaAnalyticsProvider>
    );
}