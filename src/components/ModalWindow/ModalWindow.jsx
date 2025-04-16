import styled from "styled-components";
import {Button, Modal, RadioGroup, Select} from "@gravity-ui/uikit";
import React, {useState} from "react";
import {DatePicker} from "@gravity-ui/date-components";
import {dateTimeParse} from "@gravity-ui/date-utils";
import { sendData } from '@telegram-apps/sdk';

const LessonsRadio = styled(RadioGroup)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    padding: 2rem 0;
`

const InputsDateContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 50px;
    gap: 0.5rem;
    width: 100%;
`

const DownloadButton = styled(Button)`
    padding: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const ModalContentContainer = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const ModalLabel = styled.div`
    font-weight: 700;
    font-size: 2rem;
`

export default function ModalWindow({open, setOpen, lessons, groupId}) {

    const [startDate, setStartDate] = useState(dateTimeParse(new Date()));
    const [endDate, setEndDate] = useState(dateTimeParse(new Date()));
    const [lesson, setLesson] = useState(null);
    const [isAllLessonsToDownload, setIsAllLessonsToDownload] = useState(true);

    const downloadAttendance = async (url) => {
        // const link = document.createElement('a');
        // link.href = blob;
        // link.setAttribute('download', name);
        // document.body.appendChild(link);
        // link.click();
        //
        // document.body.removeChild(link);
        // window.URL.revokeObjectURL(blob);

        if (sendData.isAvailable()) {
            const data = {
                action: 'download_file',
                url: url
            };
            sendData(JSON.stringify(data));
        } else {
            console.error('sendData не доступен');
        }
    };

    const onSubmit = async () => {
        const format = 'YYYY-MM-DD';
        const start = dateTimeParse(startDate)?.format(format);
        const end = dateTimeParse(endDate)?.format(format);
        try {
            if(isAllLessonsToDownload) {
                // const blob = await exportAllLessonsAttendance(groupId, startDate, endDate);
                // const name = `Посещаемость(${start} - ${end}).xlsx`;
                // await downloadAttendance(blob, name);

                const url = `https://elejournal.ru/attendance/file?groupId=${groupId}&startDate=${start}&endDate=${end}`;
                await downloadAttendance(url);
                return;
            }
            if(lesson) {
                // const blob = await exportLessonAttendance(groupId, startDate, endDate, lesson);
                // const name = `Посещаемость ${lesson}(${start} - ${end}).xlsx`;
                // await downloadAttendance(blob, name);
                const url = `https://elejournal.ru/attendance/file/lesson?groupId=${groupId}&startDate=${start}&endDate=${end}&lessonName=${lesson}`;
                await downloadAttendance(url);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const selectOptions = lessons.map((lesson) => {
        return {value: lesson, content: lesson};
    });

    const options = [
        {value: '1', content: 'Посещаемость по всем предметам'},
        {value: '2', content: 'Посещаемость по одному предмету'}
    ];

    const isSubmitActive = isAllLessonsToDownload ? true
        : !!lesson;

    return (
        <Modal open={open}
               onOpenChange={() => {
                   setOpen(false);
                   setLesson(null);
                   setIsAllLessonsToDownload(true);
               }}>
            <ModalContentContainer>
                <ModalLabel>Параметры</ModalLabel>
                <form>
                    <InputsContainer>
                        <LessonsRadio defaultValue={options[0].value}
                                    options={options}
                                    size={'l'}
                                    onChange={() => setIsAllLessonsToDownload(!isAllLessonsToDownload)}/>
                        <Select options={selectOptions}
                                disabled={isAllLessonsToDownload}
                                placeholder={'Предмет'}
                                onUpdate={(e) => {
                                    setLesson(e[0]);
                                }}
                                style={{
                                    padding: '20px 0',
                                }}/>
                        <InputsDateContainer>
                        <DatePicker
                            label={"Начальная дата: "}
                            format="YYYY-MM-DD"
                            value={dateTimeParse(startDate)}
                            onUpdate={e => {
                                setStartDate(dateTimeParse(e))
                            }} />
                        <DatePicker
                            label={"Конечная дата: "}
                            format="YYYY-MM-DD"
                            value={dateTimeParse(endDate)}
                            onUpdate={e => {
                                setEndDate(dateTimeParse(e))
                            }} />
                        </InputsDateContainer>
                    </InputsContainer>

                    <DownloadButton onClick={onSubmit} disabled={!isSubmitActive}>
                        <span>Скачать</span>
                    </DownloadButton>
                </form>
            </ModalContentContainer>
        </Modal>
    )
}