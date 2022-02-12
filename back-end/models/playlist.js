module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define('playlist', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            validate: {
            len:{
                args: [3,100],
                msg: "The length of the description must be minimum 5 letters"
            }}},
        date: {
            type: DataTypes.DATE,
            validate: {
                isAfter: {
                    args: [new Date().toString()],
                    msg: "Date must be after the date of creation."
                }
            }
    }});

    Playlist.associate = models => {
        Playlist.hasMany(models.song, {
            onDelete: "cascade"
        });
    }
    return Playlist;

}