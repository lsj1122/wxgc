#基于nginx
FROM nginx:1.15.6
#维护者信息
MAINTAINER sorel
ENV LANG C.UTF-8

RUN rm /etc/nginx/nginx.conf

#拷贝nginx设置文件
ADD nginx.conf /etc/nginx/

#nginx容器生成的一个虚拟路径，项目运行在这里
COPY dist  /usr/share/nginx/html/

#app安装包
#COPY zhxn.apk  /usr/share/nginx/html/

#复制安全证书
COPY cert  /usr/share/nginx/cert/
