FROM node

WORKDIR /home/mod

COPY package.json ./

RUN npm install --production -d --registry=https://registry.npm.taobao.org

FROM alpine:3.9

USER root

RUN apk update

#RUN apk add --no-cache libgcc
#安装libstdc++会自动安装libgcc，但是apk下安装的libstdc++是不完整的动态文件（很奇怪）
#`strings /usr/lib/libstdc++.os.6 | grep GLIBC`发现动态库文件不完整，为什么呢？
RUN apk add --no-cache --update libstdc++

#RUN apk add --no-cache --update wget
#RUN apk add --no-cache tar

#2.23-r3
ENV GLIBC_VERSION=2.27-r0

RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/sgerrand.rsa.pub \
&& wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk \
&& wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk \
&& apk --no-cache add glibc-${GLIBC_VERSION}.apk \
&& apk --no-cache add glibc-bin-${GLIBC_VERSION}.apk \
&& rm glibc-${GLIBC_VERSION}.apk \
&& rm glibc-bin-${GLIBC_VERSION}.apk

#12.10.0
ENV NODE_VERSION=v12.10.0
RUN wget https://cdn.npm.taobao.org/dist/node/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.gz \
&& tar -xf node-${NODE_VERSION}-linux-x64.tar.gz --directory /usr/local --strip-components 1 \
&& rm node-${NODE_VERSION}-linux-x64.tar.gz

RUN apk del wget tar

RUN ln -s /usr/local/bin/node /usr/bin/node

#RUN ln -s /usr/local/bin/npm /usr/bin/npm

ENV PATH "/usr/local/bin:${PATH}"

RUN echo "PATH env variable => '$PATH'"

WORKDIR /nodejs/web

#COPY --from=0 /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.22 /lib/
#直接把builder的libstdc++动态库拷贝到镜像中，暴力解决
COPY --from=0 /usr/lib/x86_64-linux-gnu/libstdc++.so.6 /usr/lib/
#RUN ln -s /lib/libstdc++.so.6.0.22 /lib/libstdc++.so.6

COPY --from=0 /home/mod/node_modules ./node_modules

COPY . .

EXPOSE 9980

CMD ["node", "app.js"]