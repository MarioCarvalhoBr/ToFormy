<script setup lang="ts">
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';

const surveyJson = {
    "locale": "pt-br",
    "title": "ToFormy",
    "description": "O projeto ToFormy é um projeto de código aberto que visa ajudar as pessoas a criar formulários de maneira fácil e rápida.",
    "completedHtml": {
     "default": "<h3>Formulário finalizado!</h3>",
    },
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "question1"
       }
      ],
      "title": "Info"
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "text",
        "name": "question2"
       }
      ],
      "title": "Address"
     },
     {
      "name": "page3",
      "elements": [
       {
        "type": "text",
        "name": "question3"
       }
      ],
      "title": "Contact"
     }
    ],
    "showPageNumbers": true,
    "showQuestionNumbers": "off",
    "showProgressBar": "bottom",
    "progressBarType": "pages",
    "mode": "edit"
   };

const alertResults = (sender: any) => {
  const results = JSON.stringify(sender.data);
  alert(results);
}

const survey = new Model(surveyJson);
survey.onComplete.add(alertResults);


</script>

<template>
  <SurveyComponent :model="survey" />
</template>
