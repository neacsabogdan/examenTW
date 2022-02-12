module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define('song', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {type: DataTypes.STRING,
        validate: {
            len: {
                args: [5,50],
                msg: "Title length must be minimum 5 characters."
            }
        }},
        url: {
            type: DataTypes.STRING,
            validate: {
                isUrl: {
                    msg: "URL format not supported"
                }
            }
        },
        style: {
            type: DataTypes.STRING,
            validate: {
            isIn: {
                args: [['POP','TRAP','JAZZ','OPERA']],
                msg: "The style of the song must be pop, trap, jazz or opera."}}},
        playlistId: DataTypes.INTEGER
    });

    Song.associate = models => {
        Song.belongsTo(models.playlist, {
            as: 'playlist',
            foreignKey: "playlistId"
        });

    }

    return Song;
}