import styled from "styled-components";
import {Button, Modal, RadioGroup, Select} from "@gravity-ui/uikit";
import React, {useState} from "react";
import {DatePicker} from "@gravity-ui/date-components";
import {dateTimeParse} from "@gravity-ui/date-utils";
import {exportAllLessonsAttendance, exportLessonAttendance} from "../../services/api/send";
import { downloadFile } from '@telegram-apps/sdk';

const LessonsRadio = styled(RadioGroup)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
`

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding-bottom: 20px;
`

const DownloadButton = styled(Button)`
    width: 100%;
`

const ModalContentContainer = styled.div`
    padding: 10px;
`

export default function ModalWindow({open, setOpen, lessons, groupId}) {

    const [startDate, setStartDate] = useState(dateTimeParse(new Date()));
    const [endDate, setEndDate] = useState(dateTimeParse(new Date()));
    const [lesson, setLesson] = useState(null);
    const [isAllLessonsToDownload, setIsAllLessonsToDownload] = useState(true);

    const downloadAttendance = async (blob, start, end) => {
        const url = URL.createObjectURL(blob);
        const name = `Посещаемость(${start} - ${end}).xlsx`;

        if (downloadFile.isAvailable()) {
            await downloadFile(url, name);
        } else {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log('загрузка из браузера');
        }
    };

    const onSubmit = async () => {
        const format = 'YYYY-MM-DD';
        const start = dateTimeParse(startDate)?.format(format);
        const end = dateTimeParse(endDate)?.format(format);
        try {
            if(isAllLessonsToDownload) {
                const blob = await exportAllLessonsAttendance(groupId, start, end);
                await downloadAttendance(blob, start, end);
                return;
            }
            if(lesson) {
                const blob = await exportLessonAttendance(groupId, start, end, lesson);
                await downloadAttendance(blob, start, end);
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
                <h2>Параметры</h2>
                <form>
                    <InputsContainer>
                        <LessonsRadio defaultValue={options[0].value}
                                    options={options}
                                    onChange={() => setIsAllLessonsToDownload(!isAllLessonsToDownload)}/>
                        <Select options={selectOptions}
                                disabled={isAllLessonsToDownload}
                                placeholder={'Предмет'}
                                onUpdate={(e) => {
                                    setLesson(e[0]);
                                }} />
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
                    </InputsContainer>

                    <DownloadButton onClick={onSubmit} disabled={!isSubmitActive}>
                        <span>Скачать</span>
                    </DownloadButton>
                </form>
            </ModalContentContainer>
        </Modal>
    )
}