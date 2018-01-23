#!/bin/bash

MYPATH="/home/ec2-user/gatling-charts-highcharts-bundle-2.3.0"
# MYPATH="/Users/mccunha/Documents/Master_Builder/POC/gatling-charts-highcharts-bundle-2.3.0/teste"

SCRIPT_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized path
pwd
echo "0 -  "
ls

sudo mv $SCRIPT_PATH/LoadTest.scala $MYPATH/user-files/simulations
pwd
echo "1 -  "
ls

sudo $MYPATH/bin/gatling.sh -s LoadTest
pwd
echo "2 -  "
ls

sudo cd $MYPATH/results
pwd
echo "3 -  "
ls

sudo aws s3 sync $MYPATH/results s3://mb-gatling-reports/reports
# aws s3 cp ./* s3://mb-gatling-reports/reports --recursive

pwd
echo "4 -  "
ls
sudo cd $MYPATH/results/*

echo "5 -  "
pwd
ls
aws s3 rm s3://mb-gatling-reports --recursive --exclude "reports/*"
sudo aws s3 sync $MYPATH/results/* s3://mb-gatling-reports

sudo rm -r $MYPATH/results/*