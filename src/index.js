import './js/services/get-default-data';

import { createHero } from './js/hero.js';
createHero();

import '/js/header.js';
import weeklyTrends from '/js/models/weeklyTrends.js';
import '/js/modalWindow.js';
// import { getMovie} from '/js/modalWindow.js';
//  document.querySelector('body').addEventListener('click', ()=>{
//     getMovie( 605579);
//  })
import { getMovie } from '/js/modalWindow.js';
//  document.querySelector('body').addEventListener('click', ()=>{
//      getMovie( 605575);
//  })
import '/js/upcoming-films.js';

weeklyTrends();
