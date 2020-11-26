# Hacker-AI

Pre-test your Show HN titles and increase your chances of hitting high points in Hacker News. 

## How it works

Visit https://www.hacker-ai.com and enter your Show HN title variations and see which one has higher chance of winning according to AI.

## Under the hood

Hacker-AI uses a brain.js feed-forward neural network machine learning model that has been trained with the below dataset that contains all stories and comments between 2006 and 2017
https://www.kaggle.com/hacker-news/hacker-news
https://github.com/HackerNews/API/blob/master/LICENSE

The title is transformed it into an array of numbers between 0 and 1 (each character is a number) and this data is fed (along with the number of points) to the neural network. After learning and iterating over the data, it spits out the prediction model that this tool uses to predict the outcome of different title variations.

## Accuracy

The current algorithm has been tested with approx. 10.000 posts. It has been able to predict 60% of the cases correctly. So, it's not perfect yet, but we at Grew use this method in a situations where we are uncertain which type of title would work, and don't have time to do "proper" pre-testing.
