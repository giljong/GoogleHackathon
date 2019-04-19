//기자 등록
const express = require('express');
const db = require('../db/connection');
const router = express.Router();
const moment = require('moment');
const randomstring = require('randomstring');