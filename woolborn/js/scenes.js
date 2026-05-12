const scenes = {
  intro: {
    chapter: "Prolog",
    text: `
Du betar i skolhagen med Genz-fåret och Arcadefåret.

Genz-fåret tuggar på gräs och säger:
"Det här är lowkey premium."

Arcadefåret pausar sin träspelmaskin.
"Vänta... hör ni bossmusik?"

Ett brinnande objekt faller från himlen.

BOOOOM.

Det landar bakom skolhagen, i den förbjudna skogen.

Rök stiger mot molnen.
    `,
    choices: [
      {
        text: "Smyg iväg genom högt gräs. [Assassin-vägen]",
        next: "assassin_approach",
        effect: () => {
          setPath("Assassin");
          stat("stealth", 2);
          quest("Ta reda på vad som föll från himlen");
        }
      },
      {
        text: "Studera röken och runorna i marken. [Mage-vägen]",
        next: "mage_approach",
        effect: () => {
          setPath("Mage");
          stat("wisdom", 2);
          quest("Ta reda på vad som föll från himlen");
        }
      },
      {
        text: "Ropa 'Detta ska vi upptäcka!' och spring. [Shaolin-vägen]",
        next: "shaolin_approach",
        effect: () => {
          setPath("Shaolin");
          stat("courage", 2);
          quest("Ta reda på vad som föll från himlen");
        }
      }
    ]
  },

  assassin_approach: {
    chapter: "Skuggvägen",
    text: `
Du försvinner mellan träden.

Bakom dig väljer de andra sina vägar:
Genz-fåret går mot den magiska energin.
Arcadefåret rusar rakt fram som om livet var ett arkadspel.

I skogen hör du en röst.

"...Jag vet att någon är där."

En drake, stor som en häst, kliver fram ur skuggorna.
    `,
    choices: [
      {
        text: "Göm dig och observera.",
        next: "first_master",
        effect: () => stat("stealth", 2)
      },
      {
        text: "Konfrontera draken öga mot öga.",
        effect: () => {
          stat("courage", 2);
          startCombat(enemies.dragonYoung, "first_master");
        }
      },
      {
        text: "Kasta en sten och smyg runt draken.",
        next: "first_master",
        effect: () => stat("wisdom", 2)
      }
    ]
  },

  mage_approach: {
    chapter: "Runvägen",
    text: `
Du närmar dig kratern långsamt.

Rökpelaren viskar i symboler.
Runorna i marken lyser under dina hovar.

Bakom dig delar sig gruppen:
Arcadefåret springer mot striden.
Genz-fåret försvinner tyst bland träden.

Artefakten från himlen reagerar på dig.
    `,
    choices: [
      {
        text: "Analysera runorna.",
        next: "first_master",
        effect: () => stat("wisdom", 2)
      },
      {
        text: "Dra fram kraften aggressivt.",
        next: "first_master",
        effect: () => stat("courage", 2)
      },
      {
        text: "Lugna energin och lyssna.",
        next: "first_master",
        effect: () => stat("stealth", 2)
      }
    ]
  },

  shaolin_approach: {
    chapter: "Modets väg",
    text: `
Du rusar mot röken.

Genz-fåret säger:
"Någon borde tänka innan vi dör."

Arcadefåret ler:
"Äntligen gameplay!"

Draken visar sig i skogen.

Du stannar inte.
    `,
    choices: [
      {
        text: "Stå kvar framför draken.",
        next: "first_master",
        effect: () => stat("courage", 2)
      },
      {
        text: "Skydda dina vänner från avstånd.",
        next: "first_master",
        effect: () => stat("wisdom", 2)
      },
      {
        text: "Rör dig snabbt runt draken.",
        next: "first_master",
        effect: () => stat("stealth", 2)
      }
    ]
  },

  first_master: {
    chapter: "Mästaren",
    onEnter: () => {
      if(!game.player.flags.masterDone){
        lockSubclass();
        grantStarterAbility();
        complete("Ta reda på vad som föll från himlen");
        game.player.flags.masterDone = true;
      }
    },
    text: `
En mästare dyker upp.

Inte som en vanlig lärare.

Som någon som redan visste att du skulle komma.

"Du är inte längre bara ett får från skolhagen."

"Din väg har svarat."

Du känner hur din subklass vaknar.

Samtidigt förs Genz-fåret och Arcadefåret bort till sina egna falanger.
    `,
    choices: [
      {
        text: "Följ mästaren till falangen.",
        next: "faction_hub"
      }
    ]
  },

  faction_hub: {
    chapter: "Falangen",
    text: `
Månader passerar.

Du tränar.
Du faller.
Du reser dig.

Assassins lär sig tystnad.
Magiker lär sig mana.
Shaolin lär sig disciplin.

Men innan du får lämna falangen måste du klara ett miniäventyr.
    `,
    choices: [
      {
        text: "Hitta den gömda scrollen. [Assassin]",
        next: "assassin_trial",
        condition: () => game.player.classPath === "Assassin"
      },
      {
        text: "Hitta enhörningen på molnet. [Mage]",
        next: "mage_trial",
        condition: () => game.player.classPath === "Mage"
      },
      {
        text: "Bestig berget Woolkong. [Shaolin]",
        next: "shaolin_trial",
        condition: () => game.player.classPath === "Shaolin"
      }
    ]
  },

  assassin_trial: {
    chapter: "Den gömda scrollen",
    onEnter: () => quest("Hitta Susano-scrollen"),
    text: `
Assassinfalangen skickar dig till Skuggskogen.

Där finns en förbjuden scroll.

SUSANO.

Den sägs ge en ninjutsu som skapar en skuggrustning av ren vilja.

Men templet vaktas av en Skuggväktare.
    `,
    choices: [
      {
        text: "Smyg förbi väktaren. [Stealth DC 11]",
        check: { stat: "stealth", dc: 11 },
        success: "trial_reward",
        fail: "shadowwarden_fight"
      },
      {
        text: "Slåss mot väktaren.",
        effect: () => startCombat(enemies.shadowWarden, "trial_reward")
      }
    ]
  },

  mage_trial: {
    chapter: "Molnön",
    onEnter: () => quest("Hitta enhörningen på molnet"),
    text: `
Magifalangen skickar dig till en ö ovanför molnen.

Där lever en enhörning med galaxögon.
Den kan väcka din riktiga mana.

Men på vägen stjäl molnimpar din energi.
    `,
    choices: [
      {
        text: "Lös runpusslet. [Wisdom DC 11]",
        check: { stat: "wisdom", dc: 11 },
        success: "trial_reward",
        fail: "cloudimp_fight"
      },
      {
        text: "Jaga bort molnimparna.",
        effect: () => startCombat(enemies.cloudImp, "trial_reward")
      }
    ]
  },

  shaolin_trial: {
    chapter: "Berget Woolkong",
    onEnter: () => quest("Bestig berget Woolkong"),
    text: `
Shaolintemplet skickar dig uppför det heliga berget.

Stormen är så stark att stenarna flyger sidledes.

På toppen sitter EP-fåret Woolkong.

"Visa mig om du bara är fluff."
    `,
    choices: [
      {
        text: "Utmana Woolkong.",
        effect: () => startCombat(enemies.woolkong, "trial_reward")
      },
      {
        text: "Meditera först. [Wisdom DC 10]",
        check: { stat: "wisdom", dc: 10 },
        success: "woolkong_focus",
        fail: "woolkong_fight"
      }
    ]
  },

  shadowwarden_fight: {
    chapter: "Combat",
    text: `
Du misslyckas med att ta dig förbi väktaren.

Skuggorna reser sig runt dig.
    `,
    choices: [
      {
        text: "Strid mot Skuggväktaren.",
        effect: () => startCombat(enemies.shadowWarden, "trial_reward")
      }
    ]
  },

  cloudimp_fight: {
    chapter: "Combat",
    text: `
Runpusslet spricker av mana.

Molnimparna skrattar och kastar sig mot dig.
    `,
    choices: [
      {
        text: "Strid mot Molnimparna.",
        effect: () => startCombat(enemies.cloudImp, "trial_reward")
      }
    ]
  },

  woolkong_fight: {
    chapter: "Combat",
    text: `
Woolkong reser sig, snurrar sin gyllene stav och pekar på dig.
    `,
    choices: [
      {
        text: "Strid mot Woolkong.",
        effect: () => startCombat(enemies.woolkong, "trial_reward")
      }
    ]
  },

  woolkong_focus: {
    chapter: "Fokus",
    onEnter: () => {
      stat("wisdom", 1);
      heal(30);
    },
    text: `
Du mediterar i stormen.

När du öppnar ögonen ser Woolkong nöjd ut.

"Bra. En krigare som tänker lever längre."

Sedan slår han dig ändå.
    `,
    choices: [
      {
        text: "Möt Woolkong.",
        effect: () => startCombat(enemies.woolkong, "trial_reward")
      }
    ]
  },

  trial_reward: {
    chapter: "Woolborn",
    onEnter: () => {
      classReward();
      complete("Hitta Susano-scrollen");
      complete("Hitta enhörningen på molnet");
      complete("Bestig berget Woolkong");
    },
    text: `
Din första riktiga kraft vaknar.

Du är inte längre lärling.

Du är Woolborn.

Men samma natt kallas alla falanger till råd.

Stormflock och Ironhoof har gått ihop.

De säkrar platsen där objektet föll.
    `,
    choices: [
      {
        text: "Gå till det stora rådet.",
        next: "council"
      }
    ]
  },

  council: {
    chapter: "Det stora rådet",
    text: `
Assassinfalangen, Magifalangen och Shaolintemplet samlas.

För första gången sedan gamla kriget står mästarna i samma sal.

Genz-fåret har förändrats.
Arcadefåret har blivit snabbare, starkare och ännu mer dramatisk.

En spejare rusar in.

"Stormflock och Ironhoof är vid kratern!"

Den gamla magikern blir blek.

"De tror att det är ett vapen."

"Men det som föll från himlen var inte vad."

"Det var vem."
    `,
    choices: [
      {
        text: "Prata med Genz-fåret innan kriget.",
        next: "genz_scene"
      },
      {
        text: "Prata med Arcadefåret innan kriget.",
        next: "arcade_scene"
      },
      {
        text: "Marscher mot kratern direkt.",
        next: "act2_map"
      }
    ]
  },

  genz_scene: {
    chapter: "Companion: Genz",
    text: `
Genz-fåret står vid en svävande karta.

"Alltså... jag skämtar mycket, men jag är rädd."

"Det där vid kratern känns som något som kan radera allt."

Han tittar på dig.

"Vi håller ihop, eller hur?"
    `,
    choices: [
      {
        text: "Lova att skydda honom.",
        next: "act2_map",
        effect: () => {
          game.player.trust.genz += 2;
          stat("leadership", 1);
        }
      },
      {
        text: "Säg att han måste klara sig själv.",
        next: "act2_map",
        effect: () => {
          game.player.trust.genz -= 1;
          stat("courage", 1);
        }
      },
      {
        text: "Ge honom en mana-kristall.",
        next: "act2_map",
        condition: () => has("Enhörningskristall"),
        effect: () => {
          game.player.trust.genz += 3;
        }
      }
    ]
  },

  arcade_scene: {
    chapter: "Companion: Arcade",
    text: `
Arcadefåret sitter på trappan och polerar sitt vapen.

"Det här är den delen där spelet blir svårt."

Han ler, men inte lika stort som vanligt.

"Om jag går ner där ute... pausa inte."
    `,
    choices: [
      {
        text: "Säg att ni vinner tillsammans.",
        next: "act2_map",
        effect: () => {
          game.player.trust.arcade += 2;
          stat("leadership", 1);
        }
      },
      {
        text: "Säg att du ska bära laget.",
        next: "act2_map",
        effect: () => {
          game.player.trust.arcade -= 1;
          stat("courage", 1);
        }
      },
      {
        text: "Utmaning: vem får flest fiender?",
        next: "act2_map",
        effect: () => {
          game.player.trust.arcade += 1;
          stat("courage", 1);
        }
      }
    ]
  },

  act2_map: {
    chapter: "Akt 2: Vägar till kratern",
    onEnter: () => quest("Bryt igenom till kratern"),
    text: `
Arméerna marscherar.

Men vägen till kratern har tre fronter:

1. Skuggpasset, där Ironhoof har spejare.
2. Stormaltaret, där Stormflock samlar blixtar.
3. Den gamla hagen, där civila får är fast.

Du kan inte göra allt utan konsekvenser.
    `,
    choices: [
      {
        text: "Ta Skuggpasset.",
        next: "shadow_pass"
      },
      {
        text: "Sabotera Stormaltaret.",
        next: "storm_altar"
      },
      {
        text: "Rädda fåren i gamla hagen.",
        next: "old_meadow"
      }
    ]
  },

  shadow_pass: {
    chapter: "Skuggpasset",
    text: `
Du leder en liten grupp genom smala raviner.

Ironhoofs spejare patrullerar med röda linsögon.

Om de hinner varna Castlehorn blir slutstriden svårare.
    `,
    choices: [
      {
        text: "Smyg in och sabotera signalen. [Stealth DC 12]",
        check: { stat: "stealth", dc: 12 },
        success: "shadow_pass_success",
        fail: "iron_scout_fight"
      },
      {
        text: "Anfall direkt.",
        effect: () => startCombat(enemies.ironScout, "shadow_pass_success")
      }
    ]
  },

  storm_altar: {
    chapter: "Stormaltaret",
    text: `
Stormflock står runt ett altare av svart ullsten.

Blixtar laddas i kristaller.
Voltshade kommer bli mycket starkare om ritualen lyckas.
    `,
    choices: [
      {
        text: "Bryt ritualens runor. [Wisdom DC 12]",
        check: { stat: "wisdom", dc: 12 },
        success: "storm_altar_success",
        fail: "storm_priest_fight"
      },
      {
        text: "Storma altaret.",
        effect: () => startCombat(enemies.stormPriest, "storm_altar_success")
      }
    ]
  },

  old_meadow: {
    chapter: "Gamla hagen",
    text: `
I den gamla hagen sitter unga får fast mellan Ironhoof-maskiner och stormeld.

Det är inte strategiskt viktigt.

Men det är rätt.
    `,
    choices: [
      {
        text: "Rädda dem. [Leadership DC 11]",
        check: { stat: "leadership", dc: 11 },
        success: "old_meadow_success",
        fail: "old_meadow_cost"
      },
      {
        text: "Skicka soldater och fortsätt själv.",
        next: "act2_after_one",
        effect: () => {
          game.player.trust.genz -= 1;
          log("Några räddas, men många minns att du inte kom själv.");
        }
      }
    ]
  },

  iron_scout_fight: {
    chapter: "Combat",
    text: `
Ironhoofs spejare upptäcker dig.

Röda linsögon tänds i mörkret.
    `,
    choices: [
      {
        text: "Strid mot Ironhoof Spejare.",
        effect: () => startCombat(enemies.ironScout, "shadow_pass_success")
      }
    ]
  },

  storm_priest_fight: {
    chapter: "Combat",
    text: `
Stormflocks präst höjer sina horn.

Svart blixt samlas i luften.
    `,
    choices: [
      {
        text: "Strid mot Stormflock Präst.",
        effect: () => startCombat(enemies.stormPriest, "storm_altar_success")
      }
    ]
  },

  shadow_pass_success: {
    chapter: "Sabotage",
    onEnter: () => {
      game.player.flags.shadowPass = true;
      complete("Bryt igenom till kratern");
      xp(65);
      heal(40);
    },
    text: `
Du förstör Ironhoofs signalstation.

Castlehorns armé rör sig blindare än förut.

En hemlig väg till kratern öppnas.
    `,
    choices: [
      {
        text: "Fortsätt mot nästa front.",
        next: "act2_second_choice"
      }
    ]
  },

  storm_altar_success: {
    chapter: "Ritual bruten",
    onEnter: () => {
      game.player.flags.stormAltar = true;
      complete("Bryt igenom till kratern");
      xp(65);
      heal(40);
    },
    text: `
Altarets kristaller spricker.

Blixtarna försvinner upp i himlen.

Voltshade kommer inte få full kraft.
    `,
    choices: [
      {
        text: "Fortsätt mot nästa front.",
        next: "act2_second_choice"
      }
    ]
  },

  old_meadow_success: {
    chapter: "Räddningen",
    onEnter: () => {
      game.player.flags.savedMeadow = true;
      game.player.trust.genz += 2;
      game.player.trust.arcade += 1;
      stat("leadership", 1);
      xp(70);
      heal(50);
    },
    text: `
Du leder fåren ut ur elden.

Ett litet lamm ger dig en blå ulltråd.

"För tur."

Den känns varm i handen.
    `,
    choices: [
      {
        text: "Fortsätt mot nästa front.",
        next: "act2_second_choice",
        effect: () => item("Blå turtråd")
      }
    ]
  },

  old_meadow_cost: {
    chapter: "Priset",
    onEnter: () => {
      game.player.hp = Math.max(45, game.player.hp - 20);
      game.player.trust.genz += 1;
      game.player.morality += 1;
    },
    text: `
Du räddar fåren, men priset är högt.

Stormeld bränner din rustning.
Kratern viskar till dig när du nästan faller.

"Jag kan göra dig starkare."
    `,
    choices: [
      {
        text: "Fortsätt trots skadorna.",
        next: "act2_second_choice"
      }
    ]
  },

  act2_after_one: {
    chapter: "Mot kratern",
    text: `
Du fortsätter mot kratern.

Bakom dig växer slaget.

Alla vägar leder nu till samma plats.
    `,
    choices: [
      {
        text: "Gå vidare till kratern.",
        next: "crater_war"
      }
    ]
  },

  act2_second_choice: {
    chapter: "Andra fronten",
    text: `
Du hinner ta en front till innan kratern öppnar sig helt.

Välj noga.
    `,
    choices: [
      {
        text: "Ta Skuggpasset.",
        next: "shadow_pass",
        condition: () => !game.player.flags.shadowPass
      },
      {
        text: "Sabotera Stormaltaret.",
        next: "storm_altar",
        condition: () => !game.player.flags.stormAltar
      },
      {
        text: "Rädda fåren i gamla hagen.",
        next: "old_meadow",
        condition: () => !game.player.flags.savedMeadow
      },
      {
        text: "Gå vidare till kratern.",
        next: "crater_war"
      }
    ]
  },

  crater_war: {
    chapter: "Kriget om kratern",
    text: `
Alla arméer möts.

Assassins kommer ur skuggorna.
Magiker öppnar portaler.
Shaolinmunkar springer nedför bergen.

Stormflock kallar åska.
Ironhoof marscherar med järnhovar.

Mitt i kratern syns draken.

Den är större nu.

Mycket större.
    `,
    choices: [
      {
        text: "Led armén med taktik. [Leadership DC 12]",
        check: { stat: "leadership", dc: 12 },
        success: "army_win",
        fail: "army_loss"
      },
      {
        text: "Tryck fram med ren kraft. [Courage DC 12]",
        check: { stat: "courage", dc: 12 },
        success: "army_win",
        fail: "army_loss"
      },
      {
        text: "Använd falangernas specialstyrkor. [Din klass-stat DC 12]",
        check: {
          stat: game.player.classPath === "Assassin"
            ? "stealth"
            : game.player.classPath === "Mage"
              ? "wisdom"
              : "courage",
          dc: 12
        },
        success: "army_win",
        fail: "army_loss"
      }
    ]
  },

  army_win: {
    chapter: "Genombrott",
    onEnter: () => {
      xp(90);
      game.player.flags.armyStrong = true;
      heal(60);
    },
    text: `
Din armé bryter igenom.

Genz-fåret håller vänster flank.
Arcadefåret slår igenom höger.

Castlehorn går fram.

Ett helt slott rör sig på hans rygg.
    `,
    choices: [
      {
        text: "Möt Castlehorn.",
        effect: () => startCombat(enemies.castlehorn, "after_castlehorn")
      }
    ]
  },

  army_loss: {
    chapter: "Blod och ull",
    onEnter: () => {
      game.player.hp = Math.max(55, game.player.hp - 25);
      game.player.morality += 1;
      heal(35);
    },
    text: `
Fronten spricker.

Många faller.
Kratern blir starkare.

Castlehorn skrattar när han kliver fram.

"Ni är inte en armé. Ni är en filt."
    `,
    choices: [
      {
        text: "Möt Castlehorn.",
        effect: () => startCombat(enemies.castlehorn, "after_castlehorn")
      }
    ]
  },

  after_castlehorn: {
    chapter: "Castlehorn faller",
    onEnter: () => heal(60),
    text: `
Castlehorn kraschar ner som ett rasande berg.

Men segern varar bara en sekund.

Himlen öppnas.

Voltshade svävar ner med mörka blixtar runt hornen.

"Castlehorn ville äga kraterhjärtat."

"Jag vill väcka det."
    `,
    choices: [
      {
        text: "Möt Voltshade.",
        effect: () => startCombat(enemies.voltshade, "after_voltshade")
      }
    ]
  },

  after_voltshade: {
    chapter: "Stormen tystnar",
    onEnter: () => heal(70),
    text: `
Voltshade faller, men hans sista blixt slår ner i kratern.

Objektet från himlen öppnar sig.

Draken vrålar.

Inte av hat.

Av varning.

Genz-fåret viskar:
"Den vaktar inte skatten..."

Arcadefåret svarar:
"Den vaktar oss från skatten."
    `,
    choices: [
      {
        text: "Försök tala med draken.",
        next: "dragon_parley"
      },
      {
        text: "Förbered slutstriden.",
        next: "dragon_phase1"
      }
    ]
  },

  dragon_parley: {
    chapter: "Drakens sanning",
    text: `
Du sänker vapnet.

Drakens öga är större än hela skolhagen.

Den talar i ditt huvud:

"Jag föll inte från himlen."

"Jag följde efter det som föll."

"Kraterhjärtat skapar världar... och förstör dem."

"Om ni tar det fel, blir ni nästa Stormflock."
    `,
    choices: [
      {
        text: "Lova att inte ta hjärtat.",
        next: "dragon_phase1",
        effect: () => {
          game.player.trust.dragon += 2;
          stat("wisdom", 1);
        }
      },
      {
        text: "Säg att du behöver kraften för att rädda alla.",
        next: "dragon_phase1",
        effect: () => {
          game.player.morality += 1;
          stat("courage", 1);
        }
      },
      {
        text: "Fråga hur man förseglar det.",
        next: "dragon_phase1",
        effect: () => {
          game.player.trust.dragon += 1;
          stat("wisdom", 1);
        }
      }
    ]
  },

  dragon_phase1: {
    chapter: "Final Boss: Fas 1",
    onEnter: () => heal(80),
    text: `
Draken testar er.

Tre vänner står framför kratern.

Genz-fåret laddar mana.
Arcadefåret knäcker nacken.
Du känner hela din resa i kroppen.

Slutstriden börjar.
    `,
    choices: [
      {
        text: "Möt Void Dragon.",
        effect: () => startCombat(enemies.voidDragon1, "dragon_phase2_intro")
      }
    ]
  },

  dragon_phase2_intro: {
    chapter: "Final Boss: Fas 2",
    onEnter: () => heal(90),
    text: `
Draken faller inte.

Den växer.

Voidvingar täcker himlen.
Kraterhjärtat öppnar sig som ett blått öga.

Dina companions ställer sig bredvid dig.

Genz-fåret:
"Allt vi tränat för."

Arcadefåret:
"Final phase."
    `,
    choices: [
      {
        text: "Använd full trippelkombo.",
        effect: () => startCombat(enemies.voidDragon2, "heart_choice")
      }
    ]
  },

  void_revival: {
    chapter: "Void Revival",
    text: `
Du borde vara besegrad.

Men kraterhjärtat vägrar låta dig dö.

En blå skugga reser dig upp.

Genz-fåret ser rädd ut.
Arcadefåret säger inget.

Voiden inom dig växer.
    `,
    choices: [
      {
        text: "Fortsätt mot kratern.",
        next: "crater_war"
      },
      {
        text: "Försök kontrollera voiden. [Wisdom DC 13]",
        check: { stat: "wisdom", dc: 13 },
        success: "control_void",
        fail: "void_temptation"
      }
    ]
  },

  control_void: {
    chapter: "Kontroll",
    onEnter: () => {
      game.player.morality = Math.max(0, game.player.morality - 1);
      xp(50);
      heal(60);
    },
    text: `
Du tvingar ner voiden.

Den försvinner inte.

Men den lyder för stunden.
    `,
    choices: [
      {
        text: "Fortsätt.",
        next: "crater_war"
      }
    ]
  },

  void_temptation: {
    chapter: "Frestelsen",
    onEnter: () => {
      game.player.morality += 2;
      ability("Void Claw");
      heal(70);
    },
    text: `
Voiden svarar med ett leende.

Du får kraft.

Men priset är att rösten nu låter mer som du.
    `,
    choices: [
      {
        text: "Fortsätt.",
        next: "crater_war"
      }
    ]
  },

  heart_choice: {
    chapter: "Kraterhjärtat",
    text: `
Void Dragon faller ner runt kratern.

Men den dör inte.

Den väntar.

Kraterhjärtat svävar framför dig.

Det är inte ett vapen.
Inte en skatt.

Det är skapelsekraft.

Nu avgörs vem som vinner i slutet.
    `,
    choices: [
      {
        text: "Försegla hjärtat. [Hjältarnas slut]",
        next: "ending_heroes"
      },
      {
        text: "Dela kraften mellan de tre vännerna. [True Ending]",
        next: "ending_true",
        condition: () =>
          game.player.trust.genz >= 2 &&
          game.player.trust.arcade >= 2 &&
          game.player.morality < 4
      },
      {
        text: "Låt draken vakta hjärtat igen. [Dragon Pact]",
        next: "ending_dragon",
        condition: () => game.player.trust.dragon >= 2
      },
      {
        text: "Ta hjärtat själv. [Void Ending]",
        next: "void_self_fight",
        condition: () => game.player.morality >= 3
      },
      {
        text: "Förstör hjärtat helt. [Bitter Ending]",
        next: "ending_bitter",
        condition: () => game.player.flags.armyStrong
      }
    ]
  },

  void_self_fight: {
    chapter: "Sista striden: Du",
    text: `
När du sträcker dig mot hjärtat öppnas din egen skugga.

Den kliver ut.

Den har dina ögon.
Dina abilities.
Din hunger.

"Du vågar inte ta kraften."

"Men jag gör."
    `,
    choices: [
      {
        text: "Besegra din Void-skugga.",
        effect: () => startCombat(enemies.voidSelf, "ending_void")
      }
    ]
  },

  ending_heroes: {
    chapter: "Slut: Hjältarnas seger",
    text: `
Du förseglar kraterhjärtat.

Stormflock splittras.
Ironhoof tappar sin kraft.
Draken lyfter mot molnen.

Genz-fåret andas ut:
"Vi är officiellt lore nu."

Arcadefåret ler:
"Credits?"

Fårlandet är räddat.

Men kratern finns kvar som ett ärr i världen.
    `,
    choices: [
      {
        text: "Starta om.",
        effect: () => resetGame()
      }
    ]
  },

  ending_true: {
    chapter: "Slut: De tre Woolborn",
    text: `
Du delar hjärtats kraft med Genz-fåret och Arcadefåret.

Assassin.
Mage.
Shaolin.

Tre vägar blir en.

Falangerna svär att aldrig kriga ensamma igen.

Ni blir kända som:

DE TRE WOOLBORN.

Det bästa slutet.
    `,
    choices: [
      {
        text: "Starta om.",
        effect: () => resetGame()
      }
    ]
  },

  ending_dragon: {
    chapter: "Slut: Drakpakten",
    text: `
Du ger hjärtat tillbaka till draken.

Den böjer huvudet.

"Ni valde visdom framför makt."

Draken lägger sig runt kratern som en levande mur.

Från den dagen får bara de värdiga närma sig.

Du blir inte världens härskare.

Du blir dess väktare.
    `,
    choices: [
      {
        text: "Starta om.",
        effect: () => resetGame()
      }
    ]
  },

  ending_void: {
    chapter: "Slut: Void Woolborn",
    text: `
Du besegrar din skugga.

Sedan tar du hjärtat.

Alla slagfält tystnar.

Stormflock och Ironhoof knäböjer.
De goda falangerna backar.

Du räddade världen.

Men nu tillhör den dig.

Inuti dig öppnar Void Dragon sina ögon.
    `,
    choices: [
      {
        text: "Starta om.",
        effect: () => resetGame()
      }
    ]
  },

  ending_bitter: {
    chapter: "Slut: Den trasiga freden",
    text: `
Du förstör kraterhjärtat.

Kraften kan aldrig missbrukas.

Men magin i Fårlandet blir svagare.
Portaler slocknar.
Draken försvinner.
Falangerna överlever, men världen känns mindre.

Ni vann.

Men inte utan pris.
    `,
    choices: [
      {
        text: "Starta om.",
        effect: () => resetGame()
      }
    ]
  }
};
