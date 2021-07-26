FROM hadmarine/docker-environments:ubuntu20-node16-1.0.2

RUN git config --global core.autocrlf input

CMD zsh
