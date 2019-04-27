var Setting = require("./../models/Setting")

module.exports = () => {
  return new Promise((resolve, reject) => {
    Setting.findOrCreate({ id: "DEFAULT_SETTINGS_V1" }, { id: "DEFAULT_SETTINGS_V1" }, function(err, setting) {
      if (err) {
        return reject(err)
      }
      resolve(setting);
    })
  })
}
