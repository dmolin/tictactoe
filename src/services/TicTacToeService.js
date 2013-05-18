var fs = require('fs');

(function(module){

var Game = function(masterword, wordfile) {

    this.masterword = masterword;
    this.masterwordIndex = buildIndex(this.masterword);
    this.highscores = [];
    this.lut = loadDictionary(wordfile);

    /**
    * Submit a word on behalf of a user. A word is accepted if its letters are
    * contained in the original string submitted in the constructor, and if it
    * is in the word list at routes/wordlist.txt.
    * If the word is accepted and its score is high enough, the submission
    * should be added to the high score list. If there are multiple submissions
    * with the same score, all are accepted, but the first submission with that
    * score should rank higher.
    *
    * @parameter word User's submission. All submissions may be assumed to be
    *             lowercase and containing no whitespace or special
    *             characters.
    */
    /**
     * NOTE: I dropped the requirement for not using a letter more than once,
     *   since it seems to contradict one of the examples ("woolly") and, btw,
     *   we can simply say that the entered word is valid if it's present into the master dictionary
     */
    this.submitWord = function (word) {
        var cIt,
            hsIt,
            wordIndex = buildIndex(word);

        //check if the word is admitted (present in wordlist)
        if(!this.lut[word]) {
            //console.log("word not in lut");
            //Submission not present in global dictionary
            return {result:'failure', error:"submission not present in global dictionary"};
        }

        for(cIt in wordIndex) {
            if(wordIndex.hasOwnProperty(cIt)) {
                if(!this.masterwordIndex[cIt] ||
                    wordIndex[cIt] > this.masterwordIndex[cIt]) {
                    return {result:'failure', error:"invalid anagram"};
                }
            }
        }

        //check if the word is not already in the highscores
        if(this.getWordPositionInScores(word) >= 0) {
            //duplicate entry. discard
            return {result:'failure', error:"entered word has been already provided."};
        }

        if(this.highscores.length &&
            word.length <= this.highscores[this.highscores.length-1].score &&
            this.highscores.length === MAXENTRIES) {
            //lowest score, with an already full highscore list.. discard it.
            return {result:'failure', error:"highscore roster is full. No more space for low valued words"};
        }

        //find where to insert the score in the highscore array
        for(hsIt = 0; hsIt < this.highscores.length; hsIt++) {
            if(this.highscores[hsIt].score < word.length) {
                break;
            }
        }
        this.highscores.splice(hsIt, 0, {word:word, score:word.length});

        //truncate the highscores to 10 entries
        if(this.highscores.length > 10) {
            this.highscores.splice(10);
        }

        return {result:'success', item:{word:word, score:word.length}};
    };

    /**
    * Return word entry at given position in the high score list, 0 being the
    * highest (best score) and 9 the lowest. You may assume that this method
    * will never be called with position > 9.
    *
    * @parameter position Index on high score list
    * @return word entry at given position in the high score list, or null if
    *         there is no entry at that position
    */
    this.getWordEntryAtPosition = function (position) {
       return position > (this.highscores.length - 1) ? null : this.highscores[position].word;
    };

    /**
    * Return score at given position in the high score list, 0 being the
    * highest (best score) and 9 the lowest. You may assume that this method
    * will never be called with position > 9.
    *
    * @parameter position Index on high score list
    * @return score at given position in the high score list, or null if there
    *         is no entry at that position
    */
    this.getScoreAtPosition = function (position) {
       return position > (this.highscores.length - 1) ? null : this.highscores[position].score;
    };

    /**
    * Return position of a given word into the scorelist.
    *
    * @parameter word to look for position in the scorelist
    * @return position of given word, or -1 if there
    *         is no entry with that value
    */
    this.getWordPositionInScores = function(word) {
        var hsIt;

        for(hsIt = 0; hsIt < this.highscores.length; hsIt++) {
            if(this.highscores[hsIt].word === word) {
                return hsIt;
            }
        }
        return -1;
    };
};

module.exports = Game;

}(module));