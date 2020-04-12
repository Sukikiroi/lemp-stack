const Applet = imports.ui.applet;
const Main = imports.ui.main; // warningNotify, notify
const Settings = imports.ui.settings;
const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;

const UUID = "benemohamed@lemp-stack";
const HOME_DIR = GLib.get_home_dir();
const APPLET_DIR = HOME_DIR + "/.local/share/cinnamon/applets/" + UUID;
const BIN_DIR = APPLET_DIR + "/bin";
const COMMAND_START_NGINX = "service nginx restart";
const COMMAND_STOP_NGINX = "service nginx stop";
const COMMAND_START_MYSQL = "service mysql restart";
const COMMAND_STOP_MYSQL = "service mysql stop";
const COMMAND_START_PHP = "service php7.0-fpm restart";
const COMMAND_STOP_PHP = "service php7.0-fpm stop";
const COMMAND_NGINX_CONFIG_EDIT = "nemo /etc/nginx/sites-available/";
const COMMAND_PHP_CONFIG_EDIT = "sudo xed /etc/php5/apache2/php.ini";
const COMMAND_LAUNCH_PHPMYADMIN = "xdg-open http://localhost/phpmyadmin/";
const COMMAND_LAUNCH_WEBDIR = "xdg-open http://localhost/";
const COMMAND_OPEN_WEBDIR = "nemo /var/www/";
const APPLET_SETTING = "cinnamon-settings applets " + UUID;
const WHAT_IS_THIS = "xdg-open http://en.wikipedia.org/wiki/";



Gettext.bindtextdomain(UUID, HOME_DIR + "/.local/share/locale");

function _(str) {
    return Gettext.dgettext(UUID, str);
}

/**
 * LempStack class
 */
class LempStack extends Applet.TextIconApplet {
    constructor(metadata, orientation, panelHeight, instance_id) {
        super(orientation, panelHeight, instance_id);
        this.settings = new Settings.AppletSettings(this, UUID, instance_id);

        this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
            "PhpVerion",
            "PhpVerion",
            this.on_settings_changed,
            null);

        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);
        this.Menus()
        this.set_applet_label('Lemp');
        this.on_settings_changed()

    };

    on_settings_changed() {

    }


    Menus() {
        this.menu.removeAll();

        // Head
        this.head = new PopupMenu.PopupMenuItem(_("Lemp Applet"), {
            reactive: false
        });
        this.menu.addMenuItem(this.head);

        this.nginxEnabledSwitch = new PopupMenu.PopupSwitchMenuItem(_("Nginx Web Server"), this.checkService("nginx"));
        this.mysqlEnabledSwitch = new PopupMenu.PopupSwitchMenuItem(_("MySQL Server"), this.checkService("mysql"))
        this.phpEnabledSwitch = new PopupMenu.PopupSwitchMenuItem(_("PHP-FPM"), this.checkService("php7.0-fpm"))
        this.menu.addMenuItem(this.nginxEnabledSwitch);
        this.menu.addMenuItem(this.mysqlEnabledSwitch);
        this.menu.addMenuItem(this.phpEnabledSwitch);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        //add a separator to separate the toggle buttons and actions
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());


        this.menu.addAction(_("Open Web Dir"), function (event) {
            Util.spawnCommandLine(COMMAND_OPEN_WEBDIR);
        });

        this.menu.addAction(_("Launch Web Dir"), function (event) {
            Util.spawnCommandLine(COMMAND_LAUNCH_WEBDIR);
        });

        this.menu.addAction(_("Launch phpMyAdmin"), function (event) {
            Util.spawnCommandLine(COMMAND_LAUNCH_PHPMYADMIN);
        });

        this.menu.addAction(_("Edit default php.ini"), function (event) {
            Util.spawnCommandLine(COMMAND_PHP_CONFIG_EDIT);
        });

        this.menu.addAction(_("Edit Nginx Conf"), function (event) {
            Util.spawnCommandLine(COMMAND_NGINX_CONFIG_EDIT);
        });

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());



        this.menu.addAction(_("Create Vhosts"), function (event) {
            Util.spawnCommandLine('gnome-terminal' + " -e 'sh -c \"echo LempStack message: to setup  new vhost Run script!; echo " + "cd " + BIN_DIR + "; echo ./setup.sh somedomain.net" + "; exec bash\"'");

        });

        let versions = this.versions();

        this.subMenuVersions = new PopupMenu.PopupSubMenuMenuItem(_('App Version'));
        this.subMenuVersions.menu.addMenuItem(this.newIconMenuItem('info', _('Nginx Version: ') + versions.nginx, null, {
            reactive: false
        }));
        this.subMenuVersions.menu.addMenuItem(this.newIconMenuItem('info', _('Mysql Version: ') + versions.mysql, null, {
            reactive: false
        }));
        this.subMenuVersions.menu.addMenuItem(this.newIconMenuItem('info', _('PHP Version: ') + versions.php, null, {
            reactive: false
        }));
        this.menu.addMenuItem(this.subMenuVersions);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addAction(_("Settings"), function (event) {
            Util.spawnCommandLine(APPLET_SETTING);
        });
        this.menu.addAction(_("what is this?"), function (event) {
            Util.spawnCommandLine(WHAT_IS_THIS);
        });

        this.nginxEnabledSwitch.connect('toggled', Lang.bind(this, this.onapacheSwitchPressed));
        this.mysqlEnabledSwitch.connect('toggled', Lang.bind(this, this.onmysqlSwitchPressed));
        this.phpEnabledSwitch.connect('toggled', Lang.bind(this, this.onphpSwitchPressed));

    }


    on_applet_clicked(event) {
        this.Menus()
        this.menu.toggle();
    }


    onapacheSwitchPressed(item) {
        this.menu.toggle(); //Close before calling gksu
        if (item.state) {
            Util.spawnCommandLine(COMMAND_START_NGINX);
            Main.notify(_("Nginx start"));
        } else {
            Util.spawnCommandLine(COMMAND_STOP_NGINX);
            Main.notify(_("Nginx stop"));
        }
    }


    onmysqlSwitchPressed(item) {
        this.menu.toggle(); //Close before calling gksu
        if (item.state) {
            Util.spawnCommandLine(COMMAND_START_MYSQL);
            Main.notify(_("Mysql start"));
        } else {
            Util.spawnCommandLine(COMMAND_STOP_MYSQL);
            Main.notify(_("Mysql stop"));
        }
    }


    onphpSwitchPressed(item) {
        this.menu.toggle(); //Close before calling gksu
        if (item.state) {
            Util.spawnCommandLine(COMMAND_START_PHP);
            Main.notify(_("php-fpm start"));
        } else {
            Util.spawnCommandLine(COMMAND_STOP_PHP);
            Main.notify(_("php-fpm stop"));
        }
    }

    newIconMenuItem(icon, label, callback, options = {}, value = null) {
        try {
            let newItem = new PopupMenu.PopupIconMenuItem(label, icon, St.IconType.FULLCOLOR, options);
            if (callback) {
                newItem.connect("activate", Lang.bind(this, callback));
            }
            newItem.value = value;
            return newItem;
        } catch (e) {
            global.log(UUID + "::newIconMenuItem: " + e);
        }
        return null;
    }

    versions() {
        let php = GLib.spawn_command_line_sync('php -v');
        let nginx = GLib.spawn_command_line_sync('nginx -v');
        let mysql = GLib.spawn_command_line_sync('mysql -V');
        return {
            php: (/PHP (.*)/gi).exec(php)[1].trim(),
            nginx: (/nginx (.*)/gi).exec(nginx)[1].trim(),
            mysql: (/mysql (.*)/gi).exec(mysql)[1].trim()
        };
    }

    checkService(service) {
        let s = GLib.spawn_async_with_pipes(null, ["pgrep", service], null, GLib.SpawnFlags.SEARCH_PATH, null)
        let c = GLib.IOChannel.unix_new(s[3])

        let [res, pid, in_fd, out_fd, err_fd] =
        GLib.spawn_async_with_pipes(null, ["pgrep", service], null, GLib.SpawnFlags.SEARCH_PATH, null);

        let out_reader = new Gio.DataInputStream({
            base_stream: new Gio.UnixInputStream({
                fd: out_fd
            })
        });

        let [out, size] = out_reader.read_line(null);

        var result = false;
        if (out != null) {
            result = true;
        }

        return result;
    }

};

function main(metadata, orientation, panelHeight, instance_id) {
    return new LempStack(metadata, orientation, panelHeight, instance_id);
}