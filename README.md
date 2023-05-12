#!/bin/bash

# Install required packages and set up environment
sudo apt-get update && sudo apt-get install -y wget curl unzip xvfb libxi6 libgconf-2-4

# Install Chrome WebDriver
wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    sudo apt-get install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb && \
    wget -q https://chromedriver.storage.googleapis.com/113.0.5672.63/chromedriver_linux64.zip && \
    unzip chromedriver_linux64.zip && \
    rm chromedriver_linux64.zip

sudo chmod +x chromedriver

# Install Python dependencies
sudo apt-get install -y python3-pip nano tmux megatools git
pip3 install --no-cache-dir selenium==3.141.0 jupyter notebook

#Download proj
git clone https://github.com/pytholabsbot1/wa_sender.git
mkdir ~/wa_sender/templates
mv ~/wa_sender/index.html  ~/wa_sender/templates/index.html
cd ~/wa_sender
