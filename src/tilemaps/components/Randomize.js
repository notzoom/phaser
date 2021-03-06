var GetTilesWithin = require('./GetTilesWithin');
var GetRandomElement = require('../../utils/array/GetRandomElement');

/**
 * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
 * specified layer. Each tile will recieve a new index. If an array of indexes is passed in, then
 * those will be used for randomly assigning new tile indexes. If an array is not provided, the
 * indexes found within the region (excluding -1) will be used for randomly assigning new tile
 * indexes. This method only modifies tile indexes and does not change collision information.
 *
 * @param {integer} [tileX=0] - [description]
 * @param {integer} [tileY=0] - [description]
 * @param {integer} [width=max width based on tileX] - [description]
 * @param {integer} [height=max height based on tileY] - [description]
 * @param {integer[]} [indexes] - An array of indexes to randomly draw from during randomization.
 * @param {LayerData} layer - [description]
 */
var Randomize = function (tileX, tileY, width, height, indexes, layer)
{
    var i;
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    // If no indicies are given, then find all the unique indexes within the specified region
    if (indexes === undefined)
    {
        indexes = [];
        for (i = 0; i < tiles.length; i++)
        {
            if (indexes.indexOf(tiles[i].index) === -1)
            {
                indexes.push(tiles[i].index);
            }
        }
    }

    for (i = 0; i < tiles.length; i++)
    {
        tiles[i].index = GetRandomElement(indexes);
    }
};

module.exports = Randomize;
