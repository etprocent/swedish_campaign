using JSON

dat = JSON.parsefile("swedish_campaign/emailGenerator/MPs.json")

parties = String[]
consts  = String[]

for d in dat
    if  !(d["Party"] in parties)
        push!(parties, d["Party"])
    end
    if  !(d["Constituency"] in consts)
        push!(consts, d["Constituency"])
    end
end

parties
consts

out = Dict()

for p in parties
    out[p] = Dict()
    for c in consts
        out[p][c] = Dict("members"=>[])
    end
end

for d in dat
    push!(out[d["Party"]][d["Constituency"]]["members"], 
        Dict(
            "name" => d["Member"],
            "email"=> d["Email"]
            )    
    )
end

open("MPs.json", "w") do file
    write(file, JSON.json(out, 3))
end