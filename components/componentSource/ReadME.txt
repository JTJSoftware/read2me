For flite-1.4-release I had to change:
- nsFlite.cpp:
    void cmu_lex_init(void);
  -to-
    cst_lexicon *cmu_lex_init(void);

Also had to adjust the make file INCLUDES to the proper path.
