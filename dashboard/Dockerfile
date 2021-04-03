FROM node:current-buster
LABEL Author="Fouad Wahabi"

RUN useradd -u 2000 -m admin

USER admin

WORKDIR /home/admin
COPY --chown=admin:admin . .

RUN yarn

EXPOSE 4100

CMD ["yarn", "start"]