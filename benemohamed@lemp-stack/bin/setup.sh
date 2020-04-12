#/bin/sh

## TOLLS
# grep
# head
# read
# stty
# echo
# exit
# find
# exec
# sed
# cp
# ls
# mkdir
##

####################COLOR##############
clear
Color_Off='\033[0m'

Red='\033[0;31m'
Green='\033[0;32m'
Yellow='\033[0;33m'
Purple='\033[0;35m'
Cyan='\033[0;36m'
#######################################


###############################BANNER##################################
echo -e "
$Cyan
                +-++-++-++-++-++-++-++-+ +-++-++-++-++-+ +-++-++-++-+
                              Setip new Virtual Hosts
                +-++-++-++-++-++-++-++-+ +-++-++-++-++-+ +-++-++-++-+
                by Mohamed Benrebia 
"
#######################################################################

####################################################SETUP#################################################################
setup () {
    echo -n -e  "$Yellow Do you want setup (y/n)?"
    ssty=$(stty -g)
    stty raw -echo
    answer=$( while ! head -c 1 | grep -i '[ny]' ;do true ;done )
    stty $ssty
    if echo "$answer" | grep -iq "^y" ;then
        echo -n  -e "\n$Yellow Give your domain name to start setup (e.g. google.com, facebook.com)?"
        read input_variable
        if [[ -z "$input_variable" ]]; then
           echo -n  -e '%s\n' "$Red No input entered"
           exit 1
        else
           ## change to fakedomain.io
           sudo cp ../nginx/sites-available/fakedomain.io /etc/nginx/sites-available/$input_variable
           find /etc/nginx/sites-available/$input_variable -type f -exec sed -i "s/fakedomain.dz/$input_variable/g" {} \;
           sudo ln -s /etc/nginx/sites-available/$input_variable /etc/nginx/sites-enabled/
           sudo cp -R ../nginx/domain.io/ /etc/nginx/$input_variable
           sudo mkdir "/var/www/$input_variable"
           echo -n -e  "$Yellow ✓✓✓ setup Donne ✓✓✓\n"
           echo "################################################################################################################"
           echo -n  -e "$Red ✓ You Domain >> " "$Cyan http://$input_variable\n"
           echo "################################################################################################################"
           echo -n -e  "$Yellow ✓✓✓ setup Donne ✓✓✓\n"
           echo "127.0.0.1 $input_variable" | sudo tee -a /etc/hosts

        fi
    else
        echo -e "\n $Red Bye Bye "
    fi
}
#########################################################################################################################

setup
