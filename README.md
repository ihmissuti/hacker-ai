# Hacker-AI

This is an example repo of hacker-ai.com

Hacker-AI is a tool for pre-testing your Show HN titles and Product Hunt texts. 

## How it works

Visit https://www.hacker-ai.com and enter your Show HN title variations and see which one has higher chance of winning according to the neural network.

## Under the hood

Hacker-AI uses a brain.js feed-forward neural network machine learning model. The example in this Github repo uses a dataset that contains all stories and comments between 2006 and 2017.
https://www.kaggle.com/hacker-news/hacker-news

https://github.com/HackerNews/API/blob/master/LICENSE

 The live site hacker-ai.com updates it's data monthly from Hacker News API and Product Hunt API.

## Accuracy

The algorithm has been able to predict 60%-70% of the cases correctly when used together with bag-of-words analysis.
